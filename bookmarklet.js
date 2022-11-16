/*
  https://raw.githubusercontent.com/jenil/bulmaswatch/gh-pages/bookmarklet.js

  original modified to attach to inner element
  and made into function so we can lazy load
  also the issue of cross-origin text as js ;)

  also changed the way combo set selected on init
  
*/
window.bulmaSwatchBookmarklet = async (parentElementId) => {
  const myRequest = new Request("https://jenil.github.io/bulmaswatch/api/themes.json");
  await fetch(myRequest).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error, status = ${response.status}`);
    }
    return response.text();
  }).then((text) => {
    const BS = JSON.parse(text);
    const themes = BS.themes;
    let select = '<span class="select" id="theme-switcher"><select>';
    for (var i = 0; i < themes.length; i++) {
      select += `<option value="${themes[i].css}" ${themes[i].name==='Default'?'selected':''}> ${themes[i].name} </option>`;
    }
    select += '</select></span>';
    const div = document.createElement('div');
    div.innerHTML = select;
    const ele = document.getElementById(parentElementId);
    ele.appendChild(div);
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "";
    l.id = 'bulmaswatch-css';
    document.body.appendChild(l);
    const switcher = document.querySelector('#theme-switcher select');
    switcher.addEventListener("change", () => {
      l.href = switcher.value;
      const body = document.querySelector("body");
      body.className = 'none';
    });
  }).catch((error) => {
    console.log(`Error: ${error.message}`);   
  });
}



  /*
  
  var request = new XMLHttpRequest();
  request.open("GET", "https://jenil.github.io/bulmaswatch/api/themes.json", true);
  request.onreadystatechange =  async function() {
  var done = 4,
  ok = 200;
  if (request.readyState == done && request.status == ok) {
    if (request.responseText) {
      var BS = JSON.parse(request.responseText);
      console.log('bulmaswatch', BS.version);
      var themes = BS.themes;
      var select = '<span class="select" id="theme-switcher"><select>';
      for (var i = 0; i < themes.length; i++) {
        select += `<option value="${themes[i].css}" ${themes[i].name==='Default'?'selected':''}> ${themes[i].name} </option>`;
      }
      select += '</select></span>';
      var temp = document.createElement('div');
      temp.innerHTML = select;
     
      const ele = document.getElementById(parentElementId);
      
      ele.appendChild(temp);
      document.querySelector('#theme-switcher').style = '';
      var l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = "";
      l.id = 'bulmaswatch-css';
      document.body.appendChild(l);
      document.querySelector('#theme-switcher select').addEventListener("change", function() {
        l.href = this.value;
        const body = document.querySelector("body");
        body.className = 'none';
      });
    }
  }
};
request.send(null);
}
*/