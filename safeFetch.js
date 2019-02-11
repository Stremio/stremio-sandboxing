const { Request } = require('node-fetch')
const fetch = require('node-fetch')
const url = require('url')

// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
function makeSafeFetch({ allowedHosts }) {
	return function(input, init) {
		// per spec, input can be a USVString or a Request
		const request = new Request(input)
		const parsed = url.parse(request.url)
		//console.log(parsed.hostname)
		return fetch(request, init)
	}
}
module.exports = makeSafeFetch
