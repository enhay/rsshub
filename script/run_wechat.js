const fs = require('fs');
const util = require('util');
const path = require('path');
const _ = require('lodash');
const wechat = require('./wechat');
const logger = require('../lib/utils/logger');

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
    const originList = _.uniq(sList.split(','));
    const list = _.chunk(originList, parseInt(originList.length / 24, 10) + 1);
    const hours = new Date().getHours();
    const wds = list[hours];
    logger.info(`run_wechat.js hours=${hours} ${JSON.stringify(wds)}`);
    if (wds) {
        for (let i = 0; i < wds.length; i++) {
            if (wds[i]) {
                try {
                    /* eslint-disable no-await-in-loop */
                    await wechat(wds[i]);
                } catch (err) {
                    logger.error(`run_wechat.js ${err.stack}`);
                }
            }
        }
    }
    await sleep(5000);
})();
