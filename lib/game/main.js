ig.tileSize = 32
ig.width = 120
ig.height = 40

ig.module('game.main')
    .requires(
        'impact.game',
        'impact.font',

        'game.levels.generator',
        'game.entities.player',
        'game.entities.base',
        'game.entities.potion',

        'plugins.camera'
    )
    .defines(function() {  
        var CTF = ig.Game.extend({
            font: new ig.Font('media/font/default.png')
            , mapWidth: ig.width
            , mapHeight: ig.height
            , tileCount: 0
            , tileSize: ig.tileSize
            , mouseLast: {x: 0, y: 0}

            , init: function() {
                ig.input.bind(ig.KEY.LEFT_ARROW, 'left')
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right')
                ig.input.bind(ig.KEY.UP_ARROW, 'up')
                ig.input.bind(ig.KEY.DOWN_ARROW, 'down')
                ig.input.bind(ig.KEY.SPACE, 'bomb')

                this.loadLevel(ig.LevelGenerator)

                this.player = this.getEntityByName('Player')

                var cameraTileOffset = 4
                    , cameraPxOffset = cameraTileOffset * ig.tileSize
                this.camera = new ig.Camera(cameraPxOffset, cameraPxOffset, 5 );
                this.camera.trap.size.x = ig.system.width - (cameraPxOffset * 2);
                this.camera.trap.size.y = ig.system.height - (cameraPxOffset * 2);
                this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width/6 : 0;

                this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
                this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;

                this.camera.set(this.player);

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
            , draw: function() {
                this.parent()

                this.camera.follow(this.player)
                this.camera.draw()

                this.drawHUD()
            }
            , drawHUD: function() {
                this.font.draw(
                    'BOMBS: ' + this.player.bombs + '/' + this.player.bombCapacity ,
                    ig.system.width / 100 * 98,
                    ig.system.height / 100 * 2,
                    ig.Font.ALIGN.RIGHT
                )
            }
        })

        ig.main('#canvas', CTF, 30, 640, 480, 1)
    })

;