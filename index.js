const vm = require('vm')
const Router = require('router')
const qs = require('querystring')
const makeSafeFetch = require('./safeFetch')

// WARNING: This may throw!
function makeRouter(manifest, blob) {
	if (!manifest.sandbox) throw 'manifest.sandbox required'

	const runOptions = {
		// Be careful of this: https://nodejs.org/api/vm.html#vm_timeout_limitations_when_using_process_nexttick_promises_and_queuemicrotask
		// should be fine as we're not exposing any of those
		timeout: 1000,
		breakOnSigint: true,
		filename: `sandbox:${manifest.id}`,
	}
	const deps = {
		// @TODO storage
		fetch: makeSafeFetch({
			// @TODO this should depend on the previously negotiated manifest
			allowedHosts: manifest.sandbox.allowedHosts,
		}),
	}
	const ctx = vm.createContext({
		console, // @TODO think about this
		Buffer,
		setInterval, clearInterval,
		setTimeout, clearTimeout,
		setImmediate, clearImmediate,
		sandbox_require: m => {
			if (deps[m]) return deps[m]
			else throw `cannot require ${m}`
		},
		// This is empty so the addon code can set .exports
		module: {},
	})

	const addonScript = new vm.Script(blob)

	// WARNING: this can throw
	addonScript.runInContext(ctx, runOptions)
	const mod = ctx.module.exports

	const sendJSON = (res, body) => {
		res.setHeader('Content-Type', 'application/json; charset=utf-8')
		res.end(JSON.stringify(body))
	}
	
	const router = new Router()
	router.get('/manifest.json', function(req, res, next) {
		Promise.resolve()
		.then(() => mod.manifest())
		.then(manifest => sendJSON(res, manifest))
		.catch(next)
	})
	router.get('/:resource/:type/:id/:extra?.json', function(req, res, next) {
		Promise.resolve()
		.then(() => {
			const args = [req.params.resource, req.params.type, req.params.id]
				.concat(req.params.extra ? [qs.parse(req.params.extra)] : [])
			return mod.get.apply(null, args)
		})
		.then(resp => sendJSON(res, resp))
		.catch(next)
	})

	return router
}

// wrap in a promise, therefore catching any exceptions
function tryMakeRouter(manifest, blob) {
	return Promise.resolve()
	.then(() => makeRouter(manifest, blob))
}

module.exports = { tryMakeRouter }
