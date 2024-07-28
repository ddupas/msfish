import { random } from 'node-emoji';

export function re() {
	return random().emoji;
}

const abc = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭',
	'🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷',
	'🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];

export function ri(sentance = 'puppy') {
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
