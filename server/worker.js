var io = require('socket.io').listen(1337);
var lzw = require('../lib/extras/lzw.js');
var room = null;

var packLevel = function(data) {
    return lzw.encode(JSON.stringify(data))
},
unpackLevel = function(data) {
    return JSON.parse(lzw.decode(data))
}

io.sockets.on('connection', function(socket) {
    io.set('log level', 1);
    
    var ID = (socket.id).toString().substr(0, 5);
    var time = new Date;
    var team = Math.random() > 0.5 ? 'red' : 'blue'
    
    socket.on('chat:sendMessage', function (msg) {
        var time = new Date
        socket.emit('chat:message', {'event': 'messageSent', 'name': ID, 'team': team, 'text': msg, 'time': time});
        socket.broadcast.emit('chat:message', {'event': 'messageReceived', 'name': ID, 'team': team, 'text': msg, 'time': time})
    });
    
    socket.on('start', function(initial) {
        if (room === null) {
            socket.emit('createLevel');
        } else {
            socket.emit('joinLevel', packLevel(room));
        }
    });
    
    socket.on('startLevel', function() {
        socket.emit('setRemoteId', socket.id);
        socket.emit('chat:message', {'event': 'connected', 'name': ID, 'time': time, 'team': team});
        
        console.log("broadcast new player with remote id " + socket.id);
        socket.broadcast.emit('join', {remoteId:socket.id, team: team, time: time});
        socket.broadcast.emit('chat:message', {'event': 'userJoined', 'name': ID, 'time': time, 'team': team});
        
        //send all existing clients to new
        for(var i in io.sockets.sockets){
            socket.emit('join', {remoteId: i, team: team, time: time});
        }        
    });

    socket.on('levelCreation', function(data) {
        room = unpackLevel(data)
    });
    

    /**
     * universal broadcasting method
     */
    socket.on('bc', function(data) {
        socket.broadcast.emit(data.name, data.data);
    });

    /**
     * announcing to everyone!
     */
    socket.on('announce', function(data) {
        io.sockets.emit('announced', data);
    });

    
    /**
     * disconnecting
     */
    socket.on('disconnect', function() {
        console.log("disconnecting: "+socket.id);
        socket.broadcast.emit('removed', {remoteId: socket.id});
        socket.emit('chat:message', {'event': 'userSplit', 'name': ID, 'time': time, 'team': team});
    });

});



