const axios = require('../../utils/axios');
const cheerio = require('cheerio');
const logger = require('../../utils/logger');
// 资讯中心
async function news() {
  const response = await axios({
    method: 'get',
    url: 'http://www.duowan.com/news/',
    headers: {
      Referer: 'http://www.duowan.com/',
    },
  });

  const data = response.data;
  const $ = cheerio.load(data);
  const list = $('#newsAll .day-item');
  return list.map((index, item) => {
    item = $(item);

    const title = item.find('.item-fr a h2').text();
    const description = item.find('.item-fr a p').text(); // remove a
    const link = item.find('.item-fr a').attr('href');
    const pubDate = new Date(); // todo: read link detail
    return {
      title,
      description,
      link,
      pubDate,
      category: '多玩'
    };
  }).get();
}
// 电竞中心
async function club() {
  const response = await axios({
    method: 'get',
    url: 'http://news.duowan.com/',
    headers: {
      Referer: 'http://www.duowan.com/',
    },
  });

  const data = response.data;
  const $ = cheerio.load(data);
  const list = $('.mod-news .g-list li');
  return list.map((index, item) => {
    item = $(item);

    const title = item.find('.text-wrap a h4').text();
    const description = item.find('.text-wrap p').text(); // remove a
    const link = 'http://www.duowan.com' + item.find('.text-wrap a').attr('href');
    const pubDate = item.find('.fl .date').text();
    return {
      title,
      description,
      link,
      pubDate,
      category: '多玩'
    };
  }).get();
}


module.exports = async () => {
  try {
    return [].concat(await news(), await club());
  } catch (error) {
    logger.error(error);
    return [];
  }
};

