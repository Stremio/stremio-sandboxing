const blob = require('fs').readFileSync('./example/addonWithDeps/dist/main.js').toString()
require('./example/addonWithDeps/dist/main.js').manifest().then((manifest) => {
	const { tryMakeRouter } = require('./index')
	tryMakeRouter(manifest, blob)
	.then(router => {
		const http = require('http')
		const server = http.createServer((req, res) => {
			router(req, res, (err) => {
				if (err) {
					console.error(err)
					res.writeHead(500)
				} else {
					res.writeHead(404)
				}
				res.end(`request failed: ${err && err.message || 'not found'}`)
			})
		})
		server.listen(8999)
		server.on('listening', () => console.log(`listening on 8999!`))
	})
	.catch(e => {
		console.error('making a router failed', e)
	})
})


