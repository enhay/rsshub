
const axios = require('../../utils/axios');
const cheerio = require('cheerio');
const moment = require('moment');
const logger = require('../../utils/logger');
// 新闻
async function news() {
  const response = await axios({
    method: 'get',
    url: 'https://www.dianjinghu.com/news/'
  });

  const data = response.data;
  const $ = cheerio.load(data);
  const list = $('.article-left .media-lg');
  return list.map((index, item) => {
    item = $(item);
    const title = item.find('.tit').text();
    const description = item.find('.media-right p').text(); // remove a
    const link = item.attr('href');
    const dateStr = item.find('.time').text();
    let pubDate;
    if (dateStr.indexOf('小时前') !== -1) {
      pubDate = moment()
    }
    const matched = dateStr.match(/(\d+)小时前/);
    pubDate = moment().subtract(1, "days");
    if (matched) {
      pubDate = moment().subtract(matched[1], "hours");
    }
    return {
      title,
      description,
      link,
      pubDate,
      category: '电竞虎'
    };
  }).get();
};

module.exports = async () => {
  try {
    return await news();
  } catch (error) {
    logger.error(`dianjinghu router error: ${JSON.stringify(error)} ${error.stack}`);
    return [];
  }
};

