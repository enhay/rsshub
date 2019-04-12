const fs = require('fs');
const util = require('util');
const path = require('path');

const readFile = util.promisify(fs.readFile);
const appendFile = util.promisify(fs.appendFile);
const writeFile = util.promisify(fs.writeFile);
const access = util.promisify(fs.access);
const mkdir = util.promisify(fs.mkdir);

const checkDir = async (wdPath) => {
    try {
        await access(wdPath);
    } catch (err) {
        await mkdir(wdPath, {
            recursive: true,
        });
    }
};

module.exports = async (ctx, next) => {
    const wd = ctx.params.wd;
    const htmlDir = path.resolve(__dirname, '../../../../html');
    const filePath = path.resolve(htmlDir, wd, 'bill.json');
    try {
        const centent = await readFile(filePath, 'utf8');
        const data = JSON.parse(centent);
        ctx.state.data = {
            title: `微信-${data.name}`,
            link: 'https://weixin.sogou.com/',
            description: `微信-${data.name}`,
            item: data.item || [],
        };
    } catch (err) {
        ctx.state.data = {
            title: `微信`,
            link: 'https://weixin.sogou.com/',
            description: `微信`,
            item: [],
        };
        checkDir(htmlDir).then(async () => {
            const filePath = path.resolve(htmlDir, 'wd_list.txt');
            let list = '';
            try {
                list = await readFile(filePath, 'utf8');
            } catch (err) {
                writeFile(filePath, wd);
            }
            if (!list || !list.split(',').includes(wd)) {
                appendFile(filePath, `,${wd}`);
            }
        });
    }
    await next();
};
