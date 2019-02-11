const makeSafeFetch = require('./safeFetch')
const exampleAddon = require('./example/proxyAddon')

const deps = {
	fetch: makeSafeFetch({ allowedHosts: [] }),
}
exampleAddon(deps).manifest().then(m => console.log(m))
