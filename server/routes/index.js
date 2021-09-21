var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/fetch', async (req, res, next) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ height: 768, width: 1024 });
  await page.goto('https://www.indiehackers.com/milestones/2021-09-17');

  //await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await page.waitForTimeout(3000);

  //.replace(new RegExp('\\n', 'g'), '')
  var element = await page.$$eval('.milestone-entry__link', (anchors) => {
    return anchors.map((anchor) => {
      return { id: anchor.id, title: anchor.textContent, url: anchor.href, date: '2021-09-17' };
    });
  });

  var keywords = ['customer', 'paying', 'mrr', 'first', '1st'];

  element = element.filter((anchor) => {
    var exists = false;
    keywords.forEach((keyword) => {
      if (anchor.title.indexOf(keyword) !== -1) {
        exists = true;
      }
    });
    return exists;
  });

  console.log(element);

  await browser.close();

  res.send(element);
});

module.exports = router;
