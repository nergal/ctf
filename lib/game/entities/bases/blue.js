ig.module('game.entities.bases.blue')
    .requires(
        'impact.entity'
    )
    .defines(function() {
        EntityBlueBase = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/img/sprite.png', ig.config.tileSize * 2, ig.config.tileSize * 2)
            , size: {x: ig.config.tileSize * 2, y: ig.config.tileSize * 2}
            , checkAgainst: ig.Entity.TYPE.A
            , name: "Blue Base"
            , team: 'blue'

            , init: function(x, y, settings) {
                this.parent(x, y, settings)
                this.addAnim('red', 0.1, [30])
                this.addAnim('blue', 0.1, [18])
                if (this.team == 'blue') {
                    this.currentAnim = this.anims.blue
                } else {
                    this.currentAnim = this.anims.red
                }
            }
            , check: function(other) {
                if (other.team && other.team !== this.team) {
                    ig.game.player.broadcastMessage('gotFlag')
                }
            }
        })
    })

;
