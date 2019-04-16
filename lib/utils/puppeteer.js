const config = require('../config');
const puppeteer = require('puppeteer');
const os = require('os');
const fs = require('fs');

const options = {
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-infobars', '--window-position=0,0', '--ignore-certifcate-errors', '--ignore-certifcate-errors-spki-list', `--user-agent=${config.ua}`],
  headless: true,
  ignoreHTTPSErrors: true,
  userDataDir: './tmp',
};

// ubuntu wsl无法通过puppeteer安装chrome 需要使用sudo apt-get install chromium-browser
if (isWsl()) {
  options.executablePath = '/usr/bin/chromium-browser';
}

module.exports = async () => {
  let browser;
  if (config.puppeteerWSEndpoint) {
    browser = await puppeteer.connect({
      browserWSEndpoint: config.puppeteerWSEndpoint,
    });
  } else {
    browser = await puppeteer.launch(options);
  }

  return browser;
};

function isWsl() {
  if (process.platform !== 'linux') {
    return false;
  }

  if (os.release().includes('Microsoft')) {
    return true;
  }
  try {
    return fs.readFileSync('/proc/version', 'utf8').includes('Microsoft');
  } catch (err) {
    return false;
  }
};