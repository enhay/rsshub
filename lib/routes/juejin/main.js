const axios = require('../../utils/axios');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
  const response = await axios({
    method: 'get',
    url: 'https://juejin.im/',
  });
  const $ = cheerio.load(response.data);
  const item = [];
  $('.entry-list').find('.title-row .title').each((i, elem) => {
    const ele = $(elem);
    item.push({
      title: ele.text(),
      description: ele.text(),
      link: decodeURI(`https://juejin.im${ele.attr('href')}`),
    });
  });
  ctx.state.data = {
    title: `掘金`,
    link: `https://juejin.im`,
    description: `掘金`,
    item
  };
};
