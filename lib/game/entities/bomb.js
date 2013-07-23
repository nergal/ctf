ig.module('game.entities.bomb')
    .requires(
        'impact.entity'
    )
    .defines(function() {
        EntityBomb = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/img/sprite.png', ig.tileSize, ig.tileSize)
            , size: {x: ig.tileSize, y: ig.tileSize}
            , checkAgainst: ig.Entity.TYPE.A
            , name: "Bomb"
            , zIndex: 5
            , killed: false

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
                this.killed = true
                if (this.currentAnim != this.anims.explo) {
                    this.currentAnim = this.anims.explo
                } else if (this.currentAnim.frame == 2) {
                    this.parent()
                }
            }
            , update: function() {
                if (this.killed) this.kill()
            }
        })
    })