
const axios = require('../../utils/axios');
// const cheerio = require('cheerio');
// 资讯中心
async function news() {
  const response = await axios({
    method: 'get',
    url: 'https://interface.17173.com/content/list.jsonp?callback=__jp0&categoryIds=10019,10152,10161&pageSize=30&pageNo=1',
    headers: {
      Referer: 'http://www.17173.com/',
    },
  });

  const data = JSON.parse(response.data.match(/^__jp0\((.*)\)$/)[1]).data || [];
  return data.map((item) => {
    return {
      title: item.title,
      description: item.description,
      link: item.pageUrl,
      pubDate: item.publishTime,
      category: '17173'
    };
  });
}

module.exports = async () => {
  return news();
};

