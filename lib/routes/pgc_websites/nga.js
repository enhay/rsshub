// 巴哈姆特
const axios = require('../../utils/axios');
const cheerio = require('cheerio');
const logger = require('../../utils/logger');

// 新闻
const news = async () => {
  const response = await axios({
    method: 'get',
    url: 'http://www.nga.cn/',
  });

  const data = response.data;
  const $ = cheerio.load(data);
  const list = $('.topics li');
  return list.map((index, item) => {
    item = $(item);
    const title = item.find('.tit a').text();
    const description = item.find('.dig').text();
    const link = item.find('.tit a').attr('href');
    const pubDate = item.find('.oth d').text().replace('.', '-');
    return {
      title,
      description,
      link,
      pubDate,
      category: 'nga'
    };
  }).get();
};

module.exports = async () => {
  try {
    return await news();
  } catch (error) {
    logger.error(`nga router error: ${JSON.stringify(error)} ${error.stack}`);
    return [];
  }
};
