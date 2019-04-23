
const axios = require('../../utils/axios');
const logger = require('../../utils/logger');
async function news() {
  const response = await axios({
    method: 'get',
    url: 'https://interface.17173.com/content/list.jsonp?callback=__jp0&categoryIds=10019,10152,10161&pageSize=30&pageNo=1',
    headers: {
      Referer: 'http://www.17173.com/',
    },
  });

  const data = JSON.parse(response.data.match(/^__jp0\((.*)\)$/)[1]).data || [];
  return data.map((item) => ({
    title: item.title,
    description: item.description,
    link: item.pageUrl,
    pubDate: parseInt(item.publishTime, 10),
    category: '17173'
  }));
}

module.exports = async () => {
  try {
    return await news();
  } catch (error) {
    logger.error(`17173 router error: ${JSON.stringify(error)} ${error.stack}`);
    return [];
  }
};

