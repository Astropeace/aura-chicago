const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)');
  await page.goto('https://posh.vip/c/chicago', { waitUntil: 'networkidle2' });
  
  const html = await page.evaluate(() => {
    return document.body.innerHTML.substring(0, 2000);
  });
  console.log("HTML Start:", html);
  
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => a.href);
  });
  console.log("Links found:", links);
  
  await browser.close();
})();
