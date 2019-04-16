// 巴哈姆特
const axios = require('../../utils/axios');
const cheerio = require('cheerio');
const moment = require('moment');
const logger = require('../../utils/logger');
// 新闻
async function news() {
  const response = await axios({
    method: 'get',
    url: 'http://www.ali213.net/'
  });

  const data = response.data;
  const $ = cheerio.load(data);
  const list = $('.ali-news-list li');
  return list.map((index, item) => {
    item = $(item);
    const title = item.find('a').text();
    const description = title; // remove a
    const link = item.find('a').attr('href');
    const dateStr = item.find('span').text().replace('[').replace(']');
    const pubDate = moment(dateStr, 'MM-DD');
    return {
      title,
      description,
      link,
      pubDate,
      category: '游侠网'
    };
  }).get();
};

module.exports = async () => {
  try {
    return await news();
  } catch (error) {
    logger.error(error);
    return [];
  }
};

