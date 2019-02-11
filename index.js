const vm = require('vm')
const makeSafeFetch = require('./safeFetch')

const runOptions = {
	// Be careful of this: https://nodejs.org/api/vm.html#vm_timeout_limitations_when_using_process_nexttick_promises_and_queuemicrotask
	// should be fine as we're not exposing any of those
	timeout: 1000,
	breakOnSigint: true,
	// @TODO set filename to something reasonable (e.g. addon ID)
}
const deps = {
	// @TODO storage
	fetch: makeSafeFetch({
		allowedHosts: ['v3-cinemeta.strem.io']
	}),
}
const ctx = vm.createContext({
	// @TODO console, Buffer, interval/timeout stuff 
	require: m => {
		if (deps[m]) return deps[m]
		else throw 'cannot require'
	},
	module: {},
})
vm.createContext(deps)

const exampleAddonCode = require('fs').readFileSync('./example/proxyAddon.js').toString()

// @TODO see compileFunction
// @TODO check if this one can throw if invalid code is passed
const addonScript = new vm.Script(exampleAddonCode)
//const addonScriptData = addonScript.createCachedData()

addonScript.runInContext(ctx, runOptions)
const mod = ctx.module.exports
const isValid = mod && typeof(mod.get) == 'function' && typeof(mod.manifest) == 'function'
if (!isValid) {
	// @TODO better diagnostics
	console.log('invalid addon')
} else {
	mod.manifest().then(manifest => console.log(manifest))
}
