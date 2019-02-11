const vm = require('vm')
const makeSafeFetch = require('./safeFetch')

const runOptions = {
	timeout: 1000,
	breakOnSigint: true,
}
const deps = {
	// @TODO storage
	fetch: makeSafeFetch({
		allowedHosts: ['v3-cinemeta.strem.io']
	}),
}
vm.createContext(deps)

const exampleAddonCode = require('fs').readFileSync('./example/proxyAddon.js').toString()

// @TODO check if this one can throw if invalid code is passed
const addonScript = new vm.Script(exampleAddonCode)
//const addonScriptData = addonScript.createCachedData()

addonScript.runInContext(deps, runOptions)

deps.manifest().then(manifest => console.log(manifest))
