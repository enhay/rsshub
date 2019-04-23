
const axios = require('../../utils/axios');
const cheerio = require('cheerio');
const moment = require('moment');
const logger = require('../../utils/logger');
const Promise = require('bluebird');
// 新闻



async function news(url) {
  const response = await axios({
    method: 'get',
    url,
    headers: {
      Referer: 'https://bbs.hupu.com/',
    },
  });
  const data = response.data;
  const $ = cheerio.load(data);
  const list = $('.for-list li');
  return list.map((index, item) => {
    item = $(item);
    const title = item.find('.truetit').text();
    const description = title;
    const link = 'https://bbs.hupu.com' + item.find('.truetit').attr('href');
    const pubDate = item.find('.author a:last-child').text();
    return {
      title,
      description,
      link,
      pubDate,
      category: '虎扑'
    };
  }).get();
};

module.exports = async () => {
  try {
    return Promise.all([
      news('https://bbs.hupu.com/lol'),
      news('https://bbs.hupu.com/kog'),
      news('https://bbs.hupu.com/pubg'),
      news('https://bbs.hupu.com/game'),
    ]).then((list) => {
      return [].concat(...list);
    });
  } catch (error) {
    logger.error(`hupu router error: ${JSON.stringify(error)} ${error.stack}`);
    return [];
  }
};

