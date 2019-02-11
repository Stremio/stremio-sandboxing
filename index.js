const fetch = require('node-fetch')

const exampleAddon = require('./example/proxyAddon')

exampleAddon({ fetch }).manifest().then(m => console.log(m))
