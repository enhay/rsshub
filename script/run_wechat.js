const _ = require('lodash');
const wechat = require('./wechat');
const db = require('./wechat_db');

const logger = {};
logger.info = (...arg) => {
    console.log.apply(console, [...arg, Date()]);
};
logger.error = logger.info;
logger.warning = logger.info;

const sleep = (num) =>
    new Promise((r) => {
        setTimeout(r, num);
    });

(async () => {
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
    await sleep(5000);
    process.exit(0);
})();
