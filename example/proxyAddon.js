// Simple proxy addon example
module.exports = function({ fetch }) {
	function manifest() {
		return fetch(URL).then(r=>r.json())
	}

	function get(resource, type, id) {
		// @WARNING no extra for now
		const url = URL.replace('/manifest.json', '/'+[resource, type, id].join('/')+'.json')
		return fetch(url).then(r=>r.json())
	}

	return { get, manifest }
}