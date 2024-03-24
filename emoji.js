'use strict';
const { random } = require('node-emoji');

function re() {
	const e = random();
	const c = e.emoji;
	//console.log(c);
	return c;
}

module.exports.re = re;

const abc = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭',
	'🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷',
	'🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];

function ri(sentance = 'puppy') {
	// abc['c'.charCodeAt()-'a'.charCodeAt()]
	let toret = '';
	const lowerstr = sentance.toLowerCase();
	[...lowerstr].forEach((character) => {
		const i = character.charCodeAt() - 'a'.charCodeAt();
		if (i >= 0 && i < 26) {
			toret += abc[i] + ' ';
		}
		else {
			toret += character;
		}
	});
	return toret;
}
module.exports.ri = ri;
