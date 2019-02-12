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
		sandbox: { allowedHosts: ['v3-cinemeta.strem.io'] },
	})
}

function get(resource, type, id) {
	const fetch = sandbox_require('fetch')
	if (resource == 'catalog' && id == 'animated') {
		const metas = animated.metas.map((m, i) => {
			if (isOdd(i)) m.name = `odd: ${m.name}`
			return m
		})
		return Promise.resolve({ metas })
	} else if (resource == 'catalog') {
		return fetch(`https://v3-cinemeta.strem.io/catalog/${type}/top.json`)
		.then(r => r.json())
	} else {
		return Promise.reject('failed')
	}
	// @TODO should we test require-ing fs here, to show it's really sandboxed?
}

module.exports = { manifest, get }
