const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path');

const adapter = new FileSync(path.resolve(__dirname, 'db.json'))
const db = low(adapter)

db.defaults({
    wdList: [],
    current: 0,
    hasVerify: false,
    wdStatistics: {}
}).write();

module.exports = db;
