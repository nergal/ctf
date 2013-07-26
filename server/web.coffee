connect = require 'connect'
path = require 'path'

root = path.join __dirname, '..'

connect()
    .use(connect.static root)
    .use(connect.logger 'dev')
    .listen(process.env.PORT or 5000)

