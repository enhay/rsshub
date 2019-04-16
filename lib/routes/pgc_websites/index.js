const moment = require('moment');
const Promise = require('bluebird');

const gamer = require('./gamer.js');
const gameSky = require('./gamesky.js');
const duowan = require('./duowan.js');
const one7173 = require('./17173.js');
const yzz = require('./yzz.js');
const ali = require('./ali213');

const dianjinghu = require('./dianjinghu');
const loveFan = require('./lovefanfan');
const nga = require('./nga')
const qq = require('./qq');
const sina = require('./sina');
const tuwan = require('./tuwan');
const vpgame = require('./vpgame');
const wanPlus = require('./wanplus');

const ACTree = require('../../utils/ac_automata');
const getKeyWords = require('../../config/keywords.js');
const automata = new ACTree(getKeyWords());

module.exports = async (ctx) => {
  const promiseArr = [
    one7173(),
    ali(),
    dianjinghu(),
    duowan(),
    gamer(),
    gameSky(),
    loveFan(),
    nga(),
    qq(),
    sina(),
    tuwan(),
    vpgame(),
    wanPlus(),
    yzz(),
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
    title: '游戏网站聚合',
    link: '',
    description: '聚合全网游戏资讯',
    item: out
  };
};
