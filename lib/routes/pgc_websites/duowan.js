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
    let link = item.find('.item-fr a').attr('href');
    if (link.indexOf('/') === 0) {
      link = 'http://www.duowan.com' + link;
    }
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
    let link = item.find('.text-wrap a').attr('href');
    if (link.indexOf('/') === 0) {
      link = 'http://www.duowan.com' + link;
    }
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
    logger.error(`duowan router error: ${JSON.stringify(error)} ${error.stack}`);
    return [];
  }
};

