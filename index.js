const vm = require('vm')
const makeSafeFetch = require('./safeFetch')

const deps = {
	// @TODO storage
	fetch: makeSafeFetch({
		allowedHosts: ['v3-cinemeta.strem.io']
	}),
}
vm.createContext(deps)

const exampleAddonCode = require('fs').readFileSync('./example/proxyAddon.js').toString()

const addonScript = new vm.Script(exampleAddonCode)
//const addonScriptData = addonScript.createCachedData()

addonScript.runInContext(deps, { timeout: 500 })

deps.manifest().then(manifest => console.log(manifest))
