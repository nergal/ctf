ig.module('game.entities.base')
    .requires(
        'impact.entity'
    )
    .defines(function() {
        EntityBase = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/img/sprite.png', ig.tileSize * 2, ig.tileSize * 2)
            , size: {x: ig.tileSize * 2, y: ig.tileSize * 2}
            , checkAgainst: ig.Entity.TYPE.A
            , name: "Base"

            , init: function(x, y, settings) {
                this.parent(x, y, settings)
                this.addAnim('enemy', 0.1, [30])
                this.addAnim('own', 0.1, [18])
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