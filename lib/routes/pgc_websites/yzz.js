//$('.swiper-slide.cm-list-pt li')
const moment = require('moment');
const iconv = require('iconv-lite');
// 巴哈姆特
const axios = require('../../utils/axios');
const cheerio = require('cheerio');

// 新闻
module.exports = async () => {
  const response = await axios({
    method: 'get',
    url: 'http://esports.yzz.cn/',
    responseType: 'arraybuffer',
  });

  const data = iconv.decode(response.data, 'GBK');
  const $ = cheerio.load(data);

  const list = $('.swiper-slide.cm-list-pt li');
  return list.map((index, item) => {
    item = $(item);
    const title = item.find('.text .tit').text();
    const description = item.find('.text .desp').text(); // remove a
    const link = item.find('a.cf').attr('href');
    const pubDate = moment(item.find('.date').text(), 'MM-DD');
    return {
      title,
      description,
      link,
      pubDate,
      category: '叶子猪'
    };
  }).get();
};
