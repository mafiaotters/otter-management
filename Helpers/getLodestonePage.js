// ACTUELLEMENT EN SCRAPING ⚠️
// Une fois Dawntrail sorti, les API lodestone seront refaites et faudra checker si c'est possible de faire un truc plus propre

/* Commandes dans app Heroku pour config le scraping:
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-nodejs.git
heroku buildpacks:add https://github.com/jontewks/puppeteer-heroku-buildpack.git
heroku config:set PUPPETEER_EXECUTABLE_PATH=/app/.apt/usr/bin/google-chrome
*/
const puppeteer = require('puppeteer');

async function getLodestonePage(url, divClasses) {
  // Lancer le navigateur avec des options pour simuler un utilisateur réel
  const browser = await puppeteer.launch({
    headless: true, // Mode sans tête, mettez false pour voir le navigateur
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"'
    ]
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' }); // Attendre que le réseau soit inactif

  const info = await page.evaluate((divClasses) => {
    let results = {};
    divClasses.forEach(divClass => {
      const el = document.querySelector(divClass);
      results[divClass] = el ? el.innerText : null;
    });
    return results;
  }, divClasses);
  await browser.close();
  return info;
}

module.exports = getLodestonePage;