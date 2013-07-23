ig.tileSize = 32
ig.width = 60
ig.height = 40

ig.module('game.main')
    .requires(
        'impact.game',
        'impact.font',

        'plugins.fog',

        'game.dungeon',
        'game.entities.player',
        'game.entities.base',
        'game.entities.potion',

        'plugins.camera',
        'plugins.impactconnect',
        'plugins.notification-manager'
    )
    .defines(function() {  
        Maze = ig.Game.extend({
            font: new ig.Font('media/font/04b03.font.png')
            , dungeons: []
            , mapTiles: []
            , collisionTiles: []
            , mapWidth: ig.width
            , mapHeight: ig.height
            , tileCount: 0
            , tileSize: ig.tileSize
            , console: null
            , note: new ig.NotificationManager()
            , mouseLast: {x: 0, y: 0}

            , init: function() {
                ig.input.bind(ig.KEY.LEFT_ARROW, 'left')
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right')
                ig.input.bind(ig.KEY.UP_ARROW, 'up')
                ig.input.bind(ig.KEY.DOWN_ARROW, 'down')
                ig.input.bind(ig.KEY.SPACE, 'bomb')

                ig.input.bind(ig.KEY.MOUSE1, 'mouseLeft')

                this.player       = new EntityPlayer()
                this.fog          = new ig.Fog(this.mapWidth, this.mapHeight, this.tileSize)
                this.scheduler    = new ROT.Scheduler.Simple()
                this.gamesocket   = new ig.ImpactConnect(this.player, 1337)
                this.dungeonLevel = 0

                var cameraTileOffset = 4
                    , cameraPxOffset = cameraTileOffset * ig.tileSize
                this.camera = new ig.Camera(cameraPxOffset, cameraPxOffset, 5 );
                this.camera.trap.size.x = ig.system.width - (cameraPxOffset * 2);
                this.camera.trap.size.y = ig.system.height - (cameraPxOffset * 2);
                this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width/6 : 0;

                this.loadDungeon()
            }
            , update: function() {
                this.parent();


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
            , loadDungeon: function() {
                this.entities = []
                this.namedEntities = {}
                this.collisionMap = ig.CollisionMap.staticNoCollision
                this.player.fov.viewedTiles = {}

                this.dungeon = new Dungeon(this.mapWidth, this.mapHeight)
                this.dungeon.load()
                this.dungeon.spawnPlayer(this.player)

                this.dungeons.push(this.dungeon)

                this.engine = new ROT.Engine(this.dungeon.scheduler)
                this.engine.start()

                this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
                this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;

                this.camera.set( this.player );
            }
            , viewedTile: function(x, y) {
                var key = x + ',' + y
                return this.player.fov.viewedTiles[key]
            }
            , passableTile: function(x, y) {
                var row = this.dungeon.collisionTiles[y]
                var tile

                if (row) {
                    tile = row[x]
                }

                if (typeof tile === 'undefined') {
                    return false
                } else {
                    return tile === 0
                }
            }
            , draw: function() {
                this.parent()

                // @TODO fix relative fog pos
                // this.fog.draw(this.viewedTile.bind(this))

                this.note.draw()

                this.camera.follow(this.player)
                this.camera.draw()
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
                var tEntities = this.getEntitiesByType(EntityPlayer)
                for (var i in tEntities) {
                    if (tEntities[i].remoteId === id) {
                        return tEntities[i]
                    }
                }
                return null
            }
            , write: function(text, pos) {
                this.note.spawnNote(
                    this.font
                    , text
                    , pos.x, pos.y
                    , {
                        vel: { x: 0, y: 0 }
                        , alpha: 0.5
                        , lifetime: 2.2
                        , fadetime: 0.3
                    }
                )
            }
        })

        ig.main('#canvas', Maze, 30, 640, 480, 1)
    })

;