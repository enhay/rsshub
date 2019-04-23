const axios = require('../../utils/axios');
const cheerio = require('cheerio');
const logger = require('../../utils/logger');

const headers = {
  Referer: 'https://www.gamersky.com/'
};

// 新闻
async function news() {
  const response = await axios({
    method: 'get',
    url: 'https://gnn.gamer.com.tw/index.php?k=',
    headers
  });
  const data = response.data;
  const $ = cheerio.load(data);
  const list = $('Mid2L_con contentpaging li');
  return list.map((index, item) => {
    item = $(item);
    const title = item.find('.tit .tt').text();
    const description = item.find('.con .txt').text(); // remove a
    const link = item.find('.tit .tt').attr('href');
    const pubDate = new Date(item.find('.con .time').text());
    return {
      title,
      description,
      link,
      pubDate,
      category: '游民星空'
    };
  }).get();
}
// 圈子
async function club() {
  // todo:
}

// 专栏
async function zhuanlan() {
  const response = await axios({
    method: 'get',
    url: 'https://www.gamersky.com/zl/',
    headers
  });
  const data = response.data;
  const $ = cheerio.load(data);
  const list = $('.contentpaging li');
  return list.map((index, item) => {
    item = $(item);
    const title = item.find('h3 a').text();
    const description = item.find('.con .txt').text(); // remove a
    const link = item.find('h3 a').attr('href');
    const pubDate = new Date();
    return {
      title,
      description,
      link,
      pubDate,
      category: '游民星空'
    };
  }).get();
}

module.exports = async () => {
  return [].concat(await news(), await zhuanlan());
};

module.exports = async () => {
  try {
    return await [].concat(await news(), await zhuanlan());
  } catch (error) {
    logger.error(`gamesky router error: ${JSON.stringify(error)} ${error.stack}`);
    return [];
  }
};
