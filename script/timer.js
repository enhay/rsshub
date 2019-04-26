const logger = require('../lib/utils/logger');

const interval = 60 * 60 * 1000;

const obj = {
    push: (ele) => {
        obj._timers.push(ele);
    },
    _timers: [],
    runner: async () => {
        for (let index = 0; index < obj._timers.length; index++) {
            const ele = obj._timers[index];
            logger.info(`[timer] run ${ele.name}`);
            try {
                await ele();
                await obj.sleep(10 * 1000);
            } catch (err) {
                logger.error(`[timer] ${err.stack}`);
            }
            logger.info(`[timer] finish ${ele.name}`);
        }
        setTimeout(obj.runner, interval);
    },
    sleep: async (time) => {
        return new Promise((r) => {
            setTimeout(r, time);
        });
    }
};

setTimeout(obj.runner, interval);

module.exports = obj;
