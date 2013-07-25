ig.config = {
    tileSize: 32
    , width: 30
    , height: 20
    , host: 'localhost'
    , port: 1337
}

ig.module('game.main')
    .requires(
        'impact.game',
        'impact.font',

        'game.levels.generator',
        'game.entities.player',
        'game.entities.bases.red',
        'game.entities.bases.blue',
        'game.entities.potion',
        'game.entities.projection',

        'plugins.camera',
        'plugins.impactconnect',
        'plugins.notification-manager'
    )
    .defines(function() {  
        var CTF = ig.Game.extend({
            font: new ig.Font('media/font/default.png')
            , sfont: 'media/font/default.png'
            , note: new ig.NotificationManager()
            
            , mapWidth: ig.config.width
            , mapHeight: ig.config.height
            , tileCount: 0
            , tileSize: ig.config.tileSize
            , mouseLast: {x: 0, y: 0}

            , init: function() {
                this.gamesocket = new ig.ImpactConnect(ig.config.host, ig.config.port)
                
                ig.input.bind(ig.KEY.LEFT_ARROW, 'left')
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right')
                ig.input.bind(ig.KEY.UP_ARROW, 'up')
                ig.input.bind(ig.KEY.DOWN_ARROW, 'down')
                
                ig.input.bind(ig.KEY.SPACE, 'bomb')
            }
            , createLevel: function(level) {
                level = level || ig.LevelGenerator
                this.loadLevel(level)
                
                this.player = this.getEntityByName('Player')
                this.initCamera(this.player)
                
                return level
            }
            , initCamera: function(followTo) {
                var cameraTileOffset = 4
                    , cameraPxOffset = cameraTileOffset * ig.config.tileSize
                    , collisionMap = this.getMapByName('collision')
                
                this.camera = new ig.Camera(cameraPxOffset, cameraPxOffset, 5 )
                this.camera.trap.size.x = ig.system.width - (cameraPxOffset * 2)
                this.camera.trap.size.y = ig.system.height - (cameraPxOffset * 2)
                this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width / 6 : 0

                this.camera.max.x = collisionMap.width * collisionMap.tilesize - ig.system.width
                this.camera.max.y = collisionMap.height * collisionMap.tilesize - ig.system.height

                this.camera.set(followTo)
            }
            , update: function() {
                this.parent()
                this.note.update()

                if (ig.input.pressed('mouseLeft')) {
                    this.mouseLast.x = ig.input.mouse.x
                    this.mouseLast.y = ig.input.mouse.y
                }

                if (ig.input.state('mouseLeft')) {
                    this.screen.x -= ig.input.mouse.x - this.mouseLast.x
                    this.screen.y -= ig.input.mouse.y - this.mouseLast.y
                    this.mouseLast.x = ig.input.mouse.x
                    this.mouseLast.y = ig.input.mouse.y
                }
            }
            , draw: function() {
                this.parent()
                this.note.draw()

                if (this.player) {
                    this.camera.follow(this.player)
                    this.camera.draw()
                    
                    this.drawHUD()
                }
            }
            , drawHUD: function() {
                this.font.draw(
                    'BOMBS: ' + this.player.bombs + '/' + this.player.bombCapacity ,
                    ig.system.width / 100 * 98,
                    ig.system.height / 100 * 2,
                    ig.Font.ALIGN.RIGHT
                )
            }
            , getEntityById: function(id) {
                for (var i in this.entities) {
                    if (this.entities[i].id === id) {
                        return this.entities[i]
                    }
                }
                
                return null
            }
            , getEntityByRemoteId: function(id) {
                var entities = this.getEntitiesByType(EntityPlayer)
                for (var i in entities) {
                    if (entities[i].remoteId === id) {
                        return entities[i]
                    }
                }
                
                return null
            }
            , write: function(text, pos) {
                this.note.spawnNote(
                    this.font
                    , text
                    , pos.x
                    , pos.y
                    , {
                        vel: {x: 0, y: 0}
                        , alpha: 0.5
                        , lifetime: 2.2
                        , fadetime: 0.3
                    }
                )
            }
        })

        ig.main('#canvas', CTF, 30, 640, 480, 1)
    })

;