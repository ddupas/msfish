const axios = require('axios');
const { JSDOM } = require('jsdom');
console.log('test axios jsdom');
axios.get('https://stats.warbrokers.io/squads/FISH')
  .then(function (response) {

    const xpath = '//*[@id="squad-players"]/div[*]/div[1]/a';

    const dom = new JSDOM(response.data);
    const doc = dom.window.document;

    const val = doc.evaluate(xpath, doc, null, 0, null);
    let plist = val.iterateNext();

    while (plist) {
      console.log(`${plist.textContent.trim().replace(/\n/g, '')} ==> https://stats.warbrokers.io${plist}`);
      plist = val.iterateNext();
    }

  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });

