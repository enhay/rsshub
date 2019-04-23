// 巴哈姆特
const axios = require('../../utils/axios');
const cheerio = require('cheerio');
const logger = require('../../utils/logger');

// 新闻
const news = async () => {
  const response = await axios({
    method: 'get',
    url: 'http://www.tuwan.com/news/',
    headers: {
      Referer: 'http://www.tuwan.com/news/',
    },
  });

  const data = response.data;
  const $ = cheerio.load(data);
  const list = $('.Con-l-list.cf li');
  return list.map((index, item) => {
    item = $(item);
    const title = item.find('.title a').text();
    const description = title;
    const link = item.find('.title a').attr('href');
    const pubDate = item.find('.time').text();
    return {
      title,
      description,
      link,
      pubDate,
      category: '兔玩'
    };
  }).get();
};

module.exports = async () => {
  try {
    return await news();
  } catch (error) {
    logger.error(`tuwan router error: ${JSON.stringify(error)} ${error.stack}`);
    return [];
  }
};
