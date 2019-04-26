const wechat = require('./wechat');
const db = require('./wechat_db');
const logger = require('../lib/utils/logger');

const fn = async () => {
    logger.info(`wechatRuntime start from interval`);
    const prevHours = db.get('currentHours').value();
    const hours = new Date().getHours();
    if (hours % 2 !== 0 || parseInt(hours, 10) === parseInt(prevHours, 10)) {
        logger.info(`no correct time now=${hours} prev=${prevHours}`);
        return;
    }
    db.set('currentHours', hours).write();
    const hasVerify = db.get('hasVerify').value();
    if (hasVerify) {
        logger.error(`wechatRuntime hasVerify`);
    } else {
        const index = db.get('current').value();
        const wds = db.get('wdList').uniq().nth(index).value();
        const hours = new Date().getHours();
        logger.info(`wechatRuntime hours=${hours} index=${index} wd=${wds}`);
        if (wds) {
            try {
                await wechat(wds);
                const len = db.get('wdList').uniq().size().value();
                db.update('current', n => {
                    return n >= (len - 1) ? 0 : n + 1;
                }).write();
            } catch (err) {
                logger.error(`wechatRuntime wechat err= ${err.stack}`);
            }
        }
    }
};

db.set('hasVerify', false).write();
fn();
setInterval(fn, 60 * 60 * 1000);
