const axios = require('../../utils/axios');
const logger = require('../../utils/logger');

async function news() {
  const response = await axios({
    method: 'get',
    url: 'http://www.vpgame.com/news/api/news/mix?game_type=0&limit=20',
    headers: {
      Referer: 'http://www.vpgame.com/',
    },
  });
  const baseUrl = 'http://www.vpgame.com/news/article';
  const data = response.data.data || [];
  const result = [];
  data.forEach((item) => {
    if (item.type === 'video' || item.type === 'gallery') {
      return;
    }
    let article;
    if (item.type === 'article') {
      article = item;
    } else if (item.type === 'column') {
      article = item.article;
    } else {
        logger.error(`vpgame router unknow type: ${JSON.stringify(item)}`);
        return;
    }
    result.push({
      title: article.title,
      description: article.content,
      link: `${baseUrl}/${article.id}`,
      pubDate: parseInt(item.data_key, 10) || Date.now(),
      category: 'vpgame'
    });
  });
  return result;
}

module.exports = async () => {
  try {
    return await news();
  } catch (error) {
    logger.error(`vpgame router error: ${JSON.stringify(error)} ${error.stack}`);
    return [];
  }
};
