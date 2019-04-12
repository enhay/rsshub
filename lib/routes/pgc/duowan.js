const axios = require('../../utils/axios');
const cheerio = require('cheerio');
// 资讯中心
function news() {

}
// 电竞中心
function club() {

}


module.exports = async () => {
  return [].concat(news(), club());
};

