const moment = require('moment');
const Promise = require('bluebird');

const hupu = require('./hupu');


const ACTree = require('../../utils/ac_automata');
const getKeyWords = require('../../config/keywords.js');
const automata = new ACTree(getKeyWords());

module.exports = async (ctx) => {
  const promiseArr = [
    hupu()
  ];
  const result = [];
  await Promise.map(promiseArr, (news) => {
    result.push(...news);
  }).timeout(10000).catch(() => {
    console.log('can not run allsite in 10s');
  });
  const query = ctx.query;
  const yesterday = moment(moment().format('YYYYMMDD'), 'YYYYMMDD').add(-2, 'days');
  const filter = {};
  const out = result.filter((item) => {

    const pubDate = moment(item.pubDate);
    if (pubDate < yesterday) {
      return false;
    }
    item.pubDate = pubDate.toISOString();
    if (query.all !== 'true') {
      const tags = automata.match(item.title);
      if (tags.length) {
        item.category = [item.category].concat(tags);
      } else {
        return false;
      }
    }
    if (filter[item.title]) {
      return false;
    }
    filter[item.title] = true;
    return true;
  });

  ctx.state.data = {
    title: '游戏论坛聚合',
    link: '',
    description: '聚合全网游戏论坛',
    item: out
  };
};
