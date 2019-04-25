const _ = require('lodash');
const wechat = require('./wechat');
const db = require('./wechat_db');
const logger = require('../lib/utils/logger');

const fn = async () => {
    const hasVerify = db.get('hasVerify').value();
    if (hasVerify) {
        logger.error(`run_wechat.js hasVerify`);
    } else {
        const index = db.get('current').value();
        const wds = db.get('wdList').uniq().nth(index).value();
        const hours = new Date().getHours();
        logger.info(`run_wechat.js hours=${hours} index=${index} wd=${wds}`);
        if (wds) {
            try {
                await wechat(wds);
                const len = db.get('wdList').uniq().size().value();
                db.update('current', n => {
                    return n >= (len - 1) ? 0 : n + 1;
                }).write();
            } catch (err) {
                logger.error(`run_wechat.js ${err.stack}`);
            }
        }
    }
};

let startTime = new Date().getHours();
setInterval(() => {
    logger.info(`run_wechat.js start interval`);
    const hours = new Date().getHours();
    if (hours % 2 === 0 && hours !== startTime) {
        startTime = hours;
        fn()
    }
}, 60 * 60 * 1000);
