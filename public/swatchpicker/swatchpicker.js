class SwatchPicker extends HTMLSelectElement {
	constructor() {
		super();
		const myRequest = new Request("https://jenil.github.io/bulmaswatch/api/themes.json");
	    fetch(myRequest).then((response) => {
	        if (!response.ok) {
	    		throw new Error(`HTTP error, status = ${response.status}`);
			}
			return response.text();
		}).then((text) => {
	        const themes = JSON.parse(text).themes;
	        for (var i = 0; i < themes.length; i++) {
	            const option = document.createElement('option');
	            option.setAttribute('value',themes[i].css);
	            option.textContent = themes[i].name;
	            this.add(option);
			}
		});
	}

	connectedCallback() {
		var v = localStorage.getItem('swatchpicker.value');
		if (v == null) {
			v = 'https://unpkg.com/bulmaswatch@0.8.1/cosmo/bulmaswatch.min.css';
		}

		var t = localStorage.getItem('swatchpicker.text');
		if (t == null) {
			t = 'Default';
		}
		const option = document.createElement('option');
        option.setAttribute('value',v);
	    option.textContent = t;
	    option.setSelected = true;
	    this.add(option);
		this.onchange();
		this.addEventListener("change", (e)=>{
			localStorage.setItem('swatchpicker.value',e.srcElement.value);
			localStorage.setItem('swatchpicker.text',e.srcElement.options[e.srcElement.selectedIndex].text);
		});
    }
}

customElements.define('swatch-picker', SwatchPicker, { extends: 'select' });
