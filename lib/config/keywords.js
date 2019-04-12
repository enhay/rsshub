
const fs = require('fs');
const path = require('path');
function getKeyWords() {
  console.log(__dirname, __filename);
  const text = fs.readFileSync(path.join(__dirname, 'words.txt'), 'utf8');
  return text.split(/\r?\n|,/g);
}

module.exports = getKeyWords;

