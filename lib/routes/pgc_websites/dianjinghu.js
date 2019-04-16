// 巴哈姆特
const axios = require('../../utils/axios');
const cheerio = require('cheerio');
const moment = require('moment');
const logger = require('../../utils/logger');

// 新闻
const news = async () => {
  const response = await axios({
    method: 'get',
    url: 'http://www.lovefanfan.com/portal.php?mod=list&catid=12',
    headers: {
      Referer: 'http://www.lovefanfan.com/',
    },
  });

  const data = response.data;
  const $ = cheerio.load(data);
  const list = $('.media-lg');
  return list.map((index, item) => {
    item = $(item);
    const title = item.find('.media-right tit').text();
    const description = item.find('.media-right p').text(); // remove a
    const link = item.attr('href');
    const date = item.find('.time').text();
    let pubDate;
    if (date.indexOf('小时') !== -1) {
      pubDate = moment().add(0 - date[0], "hours")
    } else if (date.indexOf('-') !== -1) {
      pubDate = moment(date, "MM-DD")
    } else {
      pubDate = new Date();
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
    logger.error(error);
    return [];
  }
};