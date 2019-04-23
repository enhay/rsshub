
const axios = require('../../utils/axios');
const cheerio = require('cheerio');
const moment = require('moment');
const logger = require('../../utils/logger');
// 新闻
async function news() {
  const response = await axios({
    method: 'get',
    url: 'https://www.titanar.com/pub/artList.action'
  });

  const data = response.data;
  const $ = cheerio.load(data);
  const list = $('.hotmes_centre .hotmesBox');
  return list.map((index, item) => {
    item = $(item);
    const title = item.find('.ht_texta').text();
    const description = item.find('.h_cent').attr('title'); // remove a
    const link = item.find('.ht_texta').attr('href');
    const dateStr = item.find('.h_date').text().replace(/[^(\d-)]/ig, '');
    const pubDate = moment(dateStr, 'YYYY-MM-DD');
    return {
      title,
      description,
      link,
      pubDate,
      category: '神之梯'
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

