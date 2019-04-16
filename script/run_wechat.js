const fs = require('fs');
const util = require('util');
const path = require('path');
const _ = require('lodash');
const wechat = require('./wechat');

const logger = {};
logger.info = (...arg) => {
    console.log.apply(console, [...arg, Date()]);
};
logger.error = logger.info;
logger.warning = logger.info;

const readFile = util.promisify(fs.readFile);

const sleep = (num) =>
    new Promise((r) => {
        setTimeout(r, num);
    });

(async () => {
    let sList = '';
    try {
        sList = await readFile(path.resolve(__dirname, '../html/wd_list.txt'), 'utf-8');
    } catch (err) {
        logger.error(`run_wechat.js no_wd_list ${err.stack}`);
        return;
    }
    sList = _.trim(sList);
    const keywordsArr = sList.split(',').map((item) => {
        return _.trim(item);
    });
    const originList = _.uniq(keywordsArr);
    // const list = _.chunk(originList, parseInt(originList.length / 24, 10) + 1);
    const list = originList;
    const hours = new Date().getHours();
    const index = hours / 2;
    const wds = list[parseInt(index, 10)];
    logger.info(`run_wechat.js hours=${hours} index=${index} ${JSON.stringify(wds)}`);
    if (wds) {
        // for (let i = 0; i < wds.length; i++) {
        //     if (wds[i]) {
                try {
                    /* eslint-disable no-await-in-loop */
                    // await wechat(wds[i]);
                    await wechat(wds);
                } catch (err) {
                    logger.error(`run_wechat.js ${err.stack}`);
                }
            // }
        // }
    }
    await sleep(5000);
    process.exit(0);
})();
