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
  const list = $('.deanartice .deanactions');
  return list.map((index, item) => {
    item = $(item);
    const title = item.find('.deanarticername a').text();
    const description = item.find('.deanarticersummary').text(); // remove a
    const link = item.find('.deanarticername a').attr('href');
    const dateStr = item.find('.deanfabushijian').text().trim();
    const pubDate = moment(dateStr, 'YYYY-M-DD HH:mm');
    return {
      title,
      description,
      link,
      pubDate,
      category: '爱饭电竞'
    };
  }).get();
};

module.exports = async () => {
  try {
    return await news();
  } catch (error) {
    logger.error(`lovefanfan router error: ${JSON.stringify(error)} ${error.stack}`);
    return [];
  }
};
