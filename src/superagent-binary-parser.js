// Binary parser for superagent

export default function binaryParser(res, fn) {
	/* global Buffer */
	let data = [];
	res.on('data', chunk => {
		return data.push(chunk)
	});
	res.on('end', () => {
		fn(null, Buffer.concat(data))
	});
};
