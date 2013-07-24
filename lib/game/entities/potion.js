ig.module('game.entities.potion')
    .requires(
        'impact.entity'
    )
    .defines(function() {
        EntityPotion = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/img/sprite.png', ig.tileSize, ig.tileSize)
            , size: {x: ig.tileSize, y: ig.tileSize}
            , checkAgainst: ig.Entity.TYPE.A
            , name: "Health Potion"

            , init: function(x, y, settings) {
                this.parent(x, y, settings)
                this.addAnim('potion', 0.1, [40])
                this.currentAnim = this.anims.potion
            }

            , check: function(other) {
                other.broadcastMessage('flag')
                if (other.bombCapacity > other.bombs) {
                    other.bombs++
                    this.kill()
                }
            }
        })
    })