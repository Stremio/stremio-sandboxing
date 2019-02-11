const { Request } = require('node-fetch')
const fetch = require('node-fetch')
const url = require('url')

// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
function makeSafeFetch({ allowedHosts }) {
	return function(input, init) {
		// per spec, input can be a USVString or a Request
		const request = new Request(input)
		const { hostname } = url.parse(request.url)
		if (!allowedHosts.includes(hostname)) {
			return Promise.reject(`disallowed hostname ${hostname}`)
		}
		return fetch(request, init)
	}
}
module.exports = makeSafeFetch
