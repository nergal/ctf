ig.module('game.entities.bomb')
    .requires(
        'impact.entity'
    )
    .defines(function() {
        EntityBomb = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/img/sprite.png', ig.config.tileSize, ig.config.tileSize)
            , size: {x: ig.config.tileSize, y: ig.config.tileSize}
            , checkAgainst: ig.Entity.TYPE.A
            , name: "Bomb"
            , zIndex: 5

            , init: function(x, y, settings) {
                this.parent(x, y, settings)
                ig.game.sortEntitiesDeferred()

                this.addAnim('active', 0.1, [44])
                this.addAnim('explo', 0.1, [40, 42, 43])
                this.currentAnim = this.anims.active

                this.timer = new ig.Timer(3)
                this._interval = setInterval(function(bomb) {
                    if (bomb.timer.delta() >= 0) {
                        clearInterval(bomb._interval)
                        bomb.kill()
                    }
                }, 500, this)
            }
            , kill: function() {
                // @TODO correct destroy animation
                var ts = ig.config.tileSize
                    , x = this.pos.x
                    , y = this.pos.y
                    , coords = [
                          {x: x + ts, y: y + ts}
                        , {x: x + ts, y: y - ts}
                        , {x: x + ts, y: y}
                        , {x: x - ts, y: y + ts}
                        , {x: x - ts, y: y - ts}
                        , {x: x - ts, y: y}
                        , {x: x, y: y + ts}
                        , {x: x, y: y - ts}
                    ]
                    , mainMap = ig.game.getMapByName('main')
                    , collisionMap = ig.game.getMapByName('collision')
                
                for (var i = 0, len = coords.length; i < len; i++) {
                    collisionMap.setTile(coords[i].x, coords[i].y, 1)
                    mainMap.setTile(coords[i].x, coords[i].y, 0)
                }

                mainMap.preRenderMapToChunks()

                this.parent()
            }
        })
    })