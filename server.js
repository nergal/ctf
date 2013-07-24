var connect = require('connect')

// @FIXME
if (process.argv.length == 4 && process.argv[2] == '-p') {
    var port = process.argv[3]

    connect.createServer(
        connect.static(__dirname)
    ).listen(port)
}

