const moment = require('moment');

const gamer = require('./gamer.js');
const gameSky = require('./gamesky.js');
const duowan = require('./duowan.js');
const one7173 = require('./17173.js');
const yzz = require('./yzz.js');

const ACTree = require('../../utils/ac_automata');
const getKeyWords = require('../../config/keywords.js');
const automata = new ACTree(getKeyWords());


module.exports = async (ctx) => {

  const gamerList = await gamer();
  const gamSkyList = await gameSky();
  const duowanList = await duowan();
  const l7173List = await one7173();
  const yzzList = await yzz();

  const result = [].concat(gamerList, gamSkyList, duowanList,
    l7173List,
    yzzList,
  );
  const yesterday = moment(moment().format('YYYYMMDD'), 'YYYYMMDD').add(-1, 'days');
  const filter = {};
  const out = result.filter((item) => {
    const pubDate = moment(item.pubDate);
    if (pubDate < yesterday) {
      return false;
    }
    item.pubDate = pubDate.toISOString();
    const tags = automata.match(item.title);
    if (tags.length) {
      item.category = [item.category].concat(tags);
    } else {
      return false;
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
