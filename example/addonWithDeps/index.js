const animated = require('./animated')
const isOdd = require('is-odd')

function manifest() {
	return Promise.resolve({
		id: 'org.example.sandboxed',
		name: 'Sandboxed addon',
		version: '1.0',
		description: 'Sandboxed much?',
		catalogs: [{type: 'movie', id: 'animated'}],
		resources: ['catalog'],
	})
}

function get(resource, type, id) {
	const fetch = sandbox_require('fetch')
	if (resource == 'catalog') {
		const metas = animated.metas.map((m, i) => {
			if (isOdd(i)) m.name = `odd: ${m.name}`
			return m
		})
		return Promise.resolve({ metas })
	} else {
		return Promise.reject('failed')
	}
	// @TODO should we test require-ing fs here, to show it's really sandboxed?
}

module.exports = { manifest, get }
