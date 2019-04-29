/* eslint-disable no-undef */
const puppeteer = require('../../utils/puppeteer');

const Promise = require('bluebird');
const logger = require('../../utils/logger');
const runTimer = require('../../../script/timer');

let cache = [];

const news = async () => {
  let browser;
  try {
    const result = [];
    browser = await puppeteer();
    const page = await browser.newPage();
    await page.goto('https://new.qq.com/ch2/esports', { waitUntil: 'load', timeout: 5 * 60 * 1000 });
    page.on('response', async (res) => {
      if (res.url().indexOf('https://pacaio.match.qq.com/irs/rcd') !== -1) {
        const resData = await res.text();
        const data = JSON.parse(resData.match(/^__jp\d+\((.*)\)$/)[1]).data || [];
        result.push(...data);
      }

    });
    await page.evaluate(() => {
      let i = 1;
      const timer = setInterval(() => {
        window.scroll(0, i * 100);
        i++;
        window.scroll(0, i * 200);
        if (i > 8) {
          clearInterval(timer);
        }
      }, 120);
    });
    await Promise.delay(10000);
    const list = result.map((item) => {
      return {
        title: item.title,
        description: item.intro,
        link: item.vurl,
        pubDate: item.publish_time,
        category: 'qq'
      };
    });
    return list;
  } catch (error) {
    logger.error(`qq chrome error: ${JSON.stringify(error)} ${error.stack}`);
    return [];
  } finally {
    browser.close();
  }
};

async function runQQCache() {
  const result = await news();
  if (result.length) {
    cache = result;
  }
}

runTimer.push(runQQCache);

runQQCache();
module.exports = async () => {
  try {
    return cache;
  } catch (error) {
    logger.error(`qq router error: ${JSON.stringify(error)} ${error.stack}`);
    return [];
  }
};
