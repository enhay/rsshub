/*eslint-disable*/
const cheerio = require('cheerio');
const fs = require('fs');
const util = require('util');
const path = require('path');
const readline = require('readline');
const _ = require('lodash');
const puppeteer = require('../lib/utils/puppeteer');
const axios = require('../lib/utils/axios');
const md5 = require('../lib/utils/md5');
const db = require('./wechat_db');
const loggerx = require('../lib/utils/logger');

const logger = {};
logger.info = (arg) => {
    loggerx.info('wechatRuntime ' + arg);
    console.log(arg);
};
logger.error = (arg) => {
    loggerx.error('wechatRuntime ' + arg);
    console.log(arg);
};

const access = util.promisify(fs.access);
const writeFile = util.promisify(fs.writeFile);
const readdir = util.promisify(fs.readdir);
const mkdir = util.promisify(fs.mkdir);

// 获取本机ip地址
function getIPAdress() {
    const interfaces = require('os').networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

const ip = getIPAdress();

const checkDir = async (wdPath) => {
    try {
        await access(wdPath);
    } catch (err) {
        await mkdir(wdPath, {
            recursive: true,
        });
    }
};

const genHtml = async (wd, urls, cnTitle) => {
    if (!urls || !urls.length || !wd) {
        return;
    }
    const wdPath = path.resolve(__dirname, '../html', wd);
    await checkDir(wdPath);
    const fileNames = await readdir(wdPath);
    const domain = 'https://mp.weixin.qq.com';
    let pros = [];
    pros = urls.map((item) =>
        (async () => {
            const htmlName = item.md5Title + '.html';
            if (fileNames.includes(htmlName)) {
                return;
            }
            try {
                let {
                    data
                } = await axios({
                    method: 'get',
                    url: domain + item.hrefs,
                });
                data = data.replace(/https?\:\/\/mmbiz\.qpic\.cn\//g, '/');
                await writeFile(path.resolve(wdPath, item.md5Title + '.html'), data, {
                    flag: 'w',
                });
            } catch (err) {
                logger.error(`wechat.js ${err.stack}`);
            }
        })()
    );
    await Promise.all(pros);
    await genBill(wd, urls, cnTitle);
};

const genBill = async (wd, urls, cnTitle) => {
    if (!wd || !urls) {
        return;
    }
    const centent = {
        name: cnTitle,
        item: [],
    };
    urls.forEach((i) => {
        centent.item.push({
            title: _.trim(i.title),
            description: _.trim(i.title),
            link: `http://${ip}:8080/${wd}/${i.md5Title}.html`,
        });
    });
    const wdPath = path.resolve(__dirname, '../html', wd);
    await writeFile(path.resolve(wdPath, 'bill.json'), JSON.stringify(centent), {
        flag: 'w',
    });
};


const yanzhengma = async (page) => {
    db.set('hasVerify', true).write();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const screenshotPath = path.resolve(__dirname, '../html/screenshot_');
    await checkDir(screenshotPath);
    const screenshotFile = `${wd}_${Date.now()}st.png`;
    await page.screenshot({
        path: path.resolve(screenshotPath, screenshotFile),
        fullPage: true,
    });
    logger.info(`验证码: http://${ip}:8080/screenshot_/${screenshotFile}`);
    if (process.env.pmx) {
        throw new Error('验证码出现');
    }
    const as = await new Promise((r) => {
        rl.question('请输入验证码:', (answer) => {
            rl.close();
            r(answer);
        });
    });
    logger.info('验证码接受到: ' + as);
    if ($('#input').length) {
        await page.type('#input', as);
        await Promise.all([
            page.waitForNavigation({
                waitUntil: 'networkidle0',
            }),
            page.click('#bt'),
        ]);
    } else if ($('#seccodeInput').length) {
        await page.type('#seccodeInput', as);
        await Promise.all([
            page.waitForNavigation({
                waitUntil: 'networkidle0',
            }),
            page.click('#submit'),
        ]);
    } else {
        logger.info('没有找到输入框');
        logger.info(html);
        throw new Error('验证码html没有找到输入框');
    }
    logger.info('验证码跳转完成');
    // db.set('hasVerify', false).write();
};

const fn = async (wd) => {
    const link = 'https://weixin.sogou.com/';
    const browser = await puppeteer();
    logger.info('----- opened browser');
    try {
        const page = await browser.newPage();
        await page.goto(link, {
            waitUntil: 'domcontentloaded',
        });
        await page.type('#query', wd);
        await Promise.all([
            page.waitForNavigation({
                waitUntil: 'networkidle0',
            }),
            page.click('#searchForm > div > input.swz2'),
        ]);
        const searchHtml = await page.evaluate(() => document.querySelector('body').innerHTML);
        let $search = cheerio.load(searchHtml);
        if ($search('.b404-box').length) {
            logger.error(`${wd}没有这个公众号`);
            return;
        }
        if (!$search('#sogou_vr_11002301_box_0 > div > div.txt-box > p.tit > a').length) {
            await yanzhengma(page);
        }
        const cnTitle = await page.evaluate(() => {
            // 强制在当前tab里跳转，否则还需要切换tab
            document.querySelector('#sogou_vr_11002301_box_0 > div > div.txt-box > p.tit > a').target = '';
            return document.querySelector('#sogou_vr_11002301_box_0 > div > div.txt-box > p.tit > a').textContent;
        });
        logger.info('----- 搜到');
        await Promise.all([
            page.waitForNavigation({
                waitUntil: 'networkidle0',
            }),
            page.click('#sogou_vr_11002301_box_0 > div > div.txt-box > p.tit > a'),
        ]);
        const html = await page.evaluate(() => document.querySelector('body').innerHTML);
        let $ = cheerio.load(html);
        if (!$('#history').length) {
            await yanzhengma(page);
            const html1 = await page.evaluate(() => document.querySelector('html').innerHTML);
            $ = cheerio.load(html1);
        }
        logger.info('----- 公众号列表页');
        const urls = [];
        $('.weui_media_title').each((index, ele) => {
            const $ele = $(ele);
            const title = $ele.text();
            const md5Title = md5(title);
            const href = $ele.attr('hrefs');
            urls.push({
                hrefs: href,
                md5Title,
                title,
            });
        });
        if (!urls.length) {
            logger.error('urls是空');
            logger.error($('body').html());
            return;
        }
        await genHtml(wd, urls, cnTitle);
        logger.info('success');
    } catch (error) {
        throw error;
    } finally {
        await browser.close();
        logger.info('browser closed');
    }
};

module.exports = fn;
