// 巴哈姆特
const axios = require('../../utils/axios');
const cheerio = require('cheerio');

// 新闻
module.exports = async () => {
  const response = await axios({
    method: 'get',
    url: 'https://gnn.gamer.com.tw/index.php?k=',
    headers: {
      Referer: 'https://www.gamer.com.tw/',
    },
  });

  const data = response.data;
  const $ = cheerio.load(data);
  const list = $('.GN-lbox2B');
  return list.map((index, item) => {
    item = $(item);
    const title = item.find('.GN-lbox2D a').text();
    const description = item.find('.GN-lbox2C').text(); // remove a
    const link = item.find('.GN-lbox2D a').attr('href');
    const pubDate = new Date(); // todo: read link detail
    return {
      title,
      description,
      link,
      pubDate,
      category: '巴哈姆特'
    };
  }).get();
};


function getFullText() {

}