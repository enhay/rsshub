const fs = require('fs');
const util = require('util');
const path = require('path');
const _ = require('lodash');
const db = require('../../../../script/wechat_db');

const readFile = util.promisify(fs.readFile);

module.exports = async (ctx, next) => {
    const wd = _.trim(ctx.params.wd);
    const htmlDir = path.resolve(__dirname, '../../../../html');
    const filePath = path.resolve(htmlDir, wd, 'bill.json');
    try {
        const centent = await readFile(filePath, 'utf8');
        const data = JSON.parse(centent);
        ctx.state.data = {
            title: `微信-${data.name}`,
            link: 'https://weixin.sogou.com/',
            description: `微信-${data.name}`,
            item: data.item || [],
        };
        db.update(`wdStatistics.${wd}`, (item) => {
            if (!item) {
                return 1;
            }
            return item + 1;
        }).write();
    } catch (err) {
        ctx.state.data = {
            title: `微信`,
            link: 'https://weixin.sogou.com/',
            description: `微信`,
            item: [],
        };
        const index = db.get('wdList').indexOf(wd).value();
        if (index === -1) {
            db.get('wdList').push(wd).write();
        }
    }
    await next();
};
