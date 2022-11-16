/*
  original:
  https://raw.githubusercontent.com/jenil/bulmaswatch/gh-pages/bookmarklet.js

  ddupas modified:
  - to attach to parent element as param
  - made into function so we can lazy load
  - combo set selected to Default
  - use fetch instead of xhttp
  
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
