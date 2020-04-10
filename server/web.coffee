connect = require 'connect'
serve_static = require 'serve-static'
logger = require 'morgan'
path = require 'path'

root = path.join __dirname, '..'

connect()
    .use(serve_static root)
    .use(logger 'dev')
    .listen(process.env.PORT or 5000)

