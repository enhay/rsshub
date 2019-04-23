
const axios = require('../../utils/axios');
const cheerio = require('cheerio');
const moment = require('moment');
const logger = require('../../utils/logger');
// 新闻
async function news() {
  const response = await axios({
    method: 'get',
    url: 'https://www.loldk.com/fm/f/a/alist.html'
  });

  const data = response.data;
  const $ = cheerio.load(data);
  const list = $('.content .top-a');
  return list.map((index, item) => {
    item = $(item);
    const title = item.find('.top-a-content a').text();
    const description = item.find('.top-a-content p').text();
    const link = 'https://www.titanar.com' + item.find('.top-a-content a').attr('href');
    const dateStr = item.find('.hl-static').text();
    const pubDate = moment(dateStr, 'MM-DD');
    return {
      title,
      description,
      link,
      pubDate,
      category: 'lol大咖'
    };
  }).get();
};

module.exports = async () => {
  try {
    return await news();
  } catch (error) {
    logger.error(`loldk router error: ${JSON.stringify(error)} ${error.stack}`);
    return [];
  }
};

