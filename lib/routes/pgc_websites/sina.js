const axios = require('../../utils/axios');
const logger = require('../../utils/logger');
const Promise = require('bluebird');

async function news() {
  return Promise.all(getNews(1), getNews(2));
}

async function getNews(pageNum) {
  const response = await axios({
    method: 'get',
    url: `http://dj.sina.com.cn/ajax_list/get_recommend_article_list/1/${pageNum}`,
    headers: {
      Referer: 'http://dj.sina.com.cn/',
    },
  });
  const list = response.data.game_list || {};
  const data = (list.result && list.result.data && list.result.data['0']) || [];

  const result = [];
  data.forEach((item) => {
    result.push({
      title: item.stitle,
      description: item.summary,
      link: item.URL,
      pubDate: item.cTime,
      category: 'sina'
    });
  });
  return result;
}

module.exports = async () => {
  try {
    return await news();
  } catch (error) {
    logger.error(`sina router error: ${JSON.stringify(error)} ${error.stack}`);
    return [];
  }
};

