io = require('socket.io').listen 1337
lzw = require '../lib/extras/lzw.js'
room = null

packLevel = (data) ->
    lzw.encode JSON.stringify data

unpackLevel = (data) ->
    JSON.parse lzw.decode data

io.sockets.on 'connection', (socket) =>
    io.set 'log level', 1

    ID = (socket.id).toString().substr 0, 5
    time = new Date
    team = if Math.random() > 0.5 then 'red' else 'blue'

    socket.on 'chat:sendMessage', (msg) =>
        data =
            event: 'messageSent'
            name: ID
            team: team
            text: msg
            time: new Date
        socket.emit 'chat:message', data

        data.event = 'messageReceived'
        socket.broadcast.emit 'chat:message', data

    socket.on 'start', (initial) =>
        if room
            socket.emit 'joinLevel', packLevel room
        else
            socket.emit 'createLevel'

    socket.on 'startLevel', =>
        data =
            name: ID
            time: new Date
            team: team
            event: 'connected'

        socket.emit 'setRemoteId', socket.id
        socket.emit 'chat:message', data

        console.log "broadcast new player with remote id " + socket.id

        data.event = 'userJoined'
        socket.broadcast.emit 'chat:message', data

        data =
            remoteId: socket.id
            team: team
            time: new Date
        socket.broadcast.emit 'join', data

        for id, sock of io.sockets.sockets
            data.remoteId = id
            socket.emit 'join', data

    socket.on 'levelCreation', (data) => room = unpackLevel data
    socket.on 'bc', (data) => socket.broadcast.emit data.name, data.data
    socket.on 'announce', (data) => io.sockets.emit 'announced', data

    socket.on 'disconnect', =>
        console.log "disconnecting: " + socket.id
        socket.broadcast.emit 'removed', {remoteId: socket.id}
        socket.emit 'chat:message', {'event': 'userSplit', 'name': ID, 'time': time, 'team': team}
