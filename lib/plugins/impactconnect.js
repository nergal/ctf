ig.module(
	'plugins.impactconnect'
)
.requires(
	'impact.impact'
).defines(function() {

	ig.ImpactConnect = ig.Class.extend({
        
        remoteId: null,
        
        packLevel: function(data) {
            return lzw.encode(JSON.stringify(data))
        },
        unpackLevel: function(data) {
            return JSON.parse(lzw.decode(data))
        },
		
		init : function(host, port) {
            var self = this
            
            var Chat = ig.Class.extend({
                chat: null,
                sock: null,
                strings: {
                    'connected': '<li class="sys"><span class="time">[%time%]</span>: Вы успешно соединились к сервером как <span class="user %team%">%name%</span>.</li>',
                    'userJoined': '<li class="sys"><span class="time">[%time%]</span>: Пользователь <span class="user %team%">%name%</span> присоединился к чату.</li>',
                    'messageSent': '<div class="out"><span class="time">[%time%]</span>: <span class="user %team%">%name%</span>: %text%</li>',
                    'messageReceived': '<li class="in"><span class="time">[%time%]</span>: <span class="user %team%">%name%</span>: %text%</li>',
                    'userSplit': '<li class="sys"><span class="time">[%time%]</span>: Пользователь <span class="user %team%">%name%</span> покинул чат.</li>'
                },
                init: function(selector, sock) {
                    this.chat = document.getElementById(selector)
                    this.sock = sock
                    
                    var input = document.getElementById('input')
                        , self = this
                    
                    input.onkeypress = function(e) {
                        if (e.which == '13') {
                            self.sock.emit('chat:sendMessage', escape(input.value));
                            input.value = '';
                        }
                    };
                    document.getElementById('send').onclick = function() {
                        self.sock.emit('chat:sendMessage', escape(input.value));
                        input.value = '';
                    };
                }
                , addMessage: function(msg) {
                    this.chat.innerHTML += this.strings[msg.event]
                        .replace(/\%team\%/, msg.team || '')
                        .replace(/\%time\%/, new Date(msg.time).toLocaleTimeString())
                        .replace(/\%name\%/, msg.name)
                        .replace(/\%text\%/,
                             unescape(msg.text)
                                .replace('<', '&lt;')
                                .replace('>', '&gt;')
                        )
                    this.chat.scrollTop = this.chat.scrollHeight;
                }
            })

            this.socket = io.connect('http://' + host + ':' + (port || 1337), {
                'reconnect' : true,
                'reconnection delay' : 500,
                'max reconnection attempts' : 10
            });

            this.chat = new Chat('log', this.socket)
			this.socket.emit('start');
			
			this.socket.on('setRemoteId', function(rId){
				ig.game.player.remoteId = rId;
				this.remoteId = rId;
			});

            this.socket.on('createLevel', function() {
                var level = ig.game.createLevel();
                self.socket.emit('levelCreation', self.packLevel(level));
                self.socket.emit('startLevel');
            });
            
            this.socket.on('joinLevel', function(data) {
                data = self.unpackLevel(data)
                ig.game.createLevel(data)
                self.socket.emit('startLevel');
            });
            
			this.socket.on('join', function(data){
				console.log(['join', data])
				if(data.remoteId != this.remoteId){
                    // @TODO team fixing
					ig.game.spawnEntity(EntityProjection, 0, 0, {
						remoteId: data.remoteId
                        , team: data.team
					});
				}
			});
			
			this.socket.on('spawnSimpleEntity', function(data){
				ig.game.spawnEntity(eval(data.ent), data.x, data.y, data.settings);
			});
			
			this.socket.on('move', function(data){
//				try {
					var ent = ig.game.getEntityByRemoteId( data.remoteId );
					console.log(data.remoteId, ent)
					ent.pos.x = data.pos.x;
					ent.pos.y = data.pos.y;
					if(ent.remoteAnim != data.remoteAnim){
						
						var newAnim = "ent.anims."+data.remoteAnim;
						ent.currentAnim = eval(newAnim);
						
						ent.currentAnim.flip.x = data.flipped;
						ent.remoteAnim = data.remoteAnim;
					}
//				} catch(e) {
//					console.error("catched: "+e);
//				}
			});

			this.socket.on('announced', function(data) {
				ig.game.write(data.text,{
					x: ig.system.width / 4,
					y: ig.system.height / 4
				});
			});
			
			this.socket.on('disconnect', function() {
				//reconnecting if not wanted to disconnect?
			});
			
			this.socket.on('removed', function(data) {
//				try {
					var ent = ig.game.getEntityByRemoteId( data.remoteId );
					ig.game.removeEntity( ent );
//				} catch(e) {
//					console.error("catched: "+e);
//				}
			});
            
            this.socket.on('chat:message', function(msg) {
                self.chat.addMessage(msg)
            });
		},
		
		send: function(name, data){
			this.socket.emit("bc", {
                name: name,
                data: data
            });
		},
		
		announce: function(data){
			this.socket.emit("announce", {text: data});
		}
	});
});
