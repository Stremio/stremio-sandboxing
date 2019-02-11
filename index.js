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
		// @TODO this should depend on the previously negotiated manifest
		allowedHosts: ['v3-cinemeta.strem.io']
	}),
}
const ctx = vm.createContext({
	// @TODO console, Buffer, interval/timeout stuff 
	require: m => {
		if (deps[m]) return deps[m]
		else throw `cannot require ${m}`
	},
	// This is empty so the addon code can set .exports
	module: {},
})

const exampleAddonCode = require('fs').readFileSync('./example/proxyAddon.js').toString()

const addonScript = new vm.Script(exampleAddonCode)

// @TODO catch the error from runInContext
// @TODO catch the case where the get() or manifest() does not return a Promise
addonScript.runInContext(ctx, runOptions)
const mod = ctx.module.exports
const isValid = mod && typeof(mod.get) == 'function' && typeof(mod.manifest) == 'function'
if (!isValid) {
	// @TODO better diagnostics
	console.log('invalid addon')
} else {
	mod.manifest().then(manifest => console.log(manifest))
}
