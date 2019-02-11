const vm = require('vm')
const makeSafeFetch = require('./safeFetch')

const deps = {
	// @TODO storage
	fetch: makeSafeFetch({
		allowedHosts: ['v3-cinemeta.strem.io']
	}),
}

const exampleAddonCode = require('fs').readFileSync('./example/proxyAddon.js').toString()

vm.createContext(deps)
vm.runInContext(exampleAddonCode, deps)

deps.manifest().then(manifest => console.log(manifest))
