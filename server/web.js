var connect = require('connect')
    , path = require('path')
    , port = process.env.PORT || 5000
    , root = path.join(__dirname, '..')
    , favicon = path.join(root, 'media/favicon.ico')

connect()
    .use(connect.favicon(favicon))
    .use(connect.static(root))
    .use(connect.logger('dev'))
    .listen(port)

