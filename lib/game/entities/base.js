ig.module('game.entities.base')
    .requires(
        'impact.entity'
    )
    .defines(function() {
        EntityBase = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/img/sprite.png', ig.tileSize, ig.tileSize)
            , size: {x: ig.tileSize, y: ig.tileSize}
            , checkAgainst: ig.Entity.TYPE.A
            , name: "Base"

            , init: function(x, y, settings) {
                this.parent(x, y, settings)
                this.addAnim('enemy', 0.1, [32])
                this.addAnim('own', 0.1, [33])
                this.currentAnim = this.anims.enemy
            }

            , check: function(other) {
                if (this.currentAnim === this.anims.own) {
                    ig.game.player.broadcastMessage('gotFlag')
                }
            }
        })
    })

;