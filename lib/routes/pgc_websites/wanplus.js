const puppeteer = require('../../utils/puppeteer');

const moment = require('moment');
const logger = require('../../utils/logger');

let cache = [];

const news = async () => {
  let browser;
  try {
    browser = await puppeteer();
    const page = await browser.newPage();
    await page.goto('https://www.wanplus.com/', { waitUntil: 'load' });
    await page.waitFor('#more', { timeout: 1000 });

    await page.click('#more');
    await page.waitForResponse('https://www.wanplus.com/ajax/index/recent');
    // 再来一次
    await page.click('#more');
    await page.waitForResponse('https://www.wanplus.com/ajax/index/recent');

    const elements = await page.$$eval('#recent_list li', (items) => {
      const result = [];
      items.forEach((item) => {
        const linkEle = item.querySelector('.alias-h3 a');
        if (!linkEle) {
          return;
        }
        const title = linkEle.textContent.trim();
        const link = linkEle.getAttribute('href').trim();
        const time = item.querySelector('.text_t .name').nextSibling.textContent.trim();
        const despEle = item.querySelector('.text_b');
        const description = despEle ? despEle.textContent.trim() : title;
        result.push({ title, link, time, description });
      });
      return result;
    });
    elements.forEach((item) => {
      if (item.time.indexOf('小时') !== -1) {
        item.pubDate = new Date();
      }
      if (item.time === '1天前') {
        item.pubDate = moment().add('-1', 'days');
      }
      item.category = '玩咖电竞';
      delete item.time;
    });
    return elements;
  } catch (error) {
    logger.error(error);
    return [];
  } finally {
    browser.close();
  }
};

async function runCache() {
  const result = await news();
  cache = result;
  setTimeout(() => {
    runCache();
  }, 1000 * 60 * 60); //每小时提前跑一次
}

runCache();
module.exports = async () => {
  try {
    return cache;
  } catch (error) {
    logger.error(error);
    return [];
  }
};
