ig.module('game.entities.player')
    .requires(
        'game.entities.creature'
        , 'game.entities.bomb'
    )
    .defines(function() {    
        EntityPlayer = EntityCreature.extend({            
            collides: ig.Entity.COLLIDES.ACTIVE
            , type: ig.Entity.TYPE.A
            // , checkAgainst: ig.Entity.TYPE.B
            , zIndex: 10
            , size: {x: ig.config.tileSize, y: ig.config.tileSize}
            , name: "Player"
            , timePressed: 0
            , repeatWait: 0
            , tileSize: ig.config.tileSize
            , seed: null
            
            , handlesInput: true
            
            , bombs: 0
            , bombCapacity: 5
            , team: 'blue'
            
            , animSheet: new ig.AnimationSheet('media/img/players.png', ig.config.tileSize, ig.config.tileSize)
            
            , init: function(x, y, settings) {
                this.parent(x, y, settings)
                
                if (this.team == 'red') {
                    this.addAnim('right', 0.1, [24, 25, 26])
                    this.addAnim('down', 0.1, [0, 1, 2])
                    this.addAnim('left', 0.1, [12, 13, 14])
                    this.addAnim('up', 0.1, [36, 37, 38])
                    this.addAnim('down_stop', 0.1, [0])
                } else {
                    this.addAnim('right', 0.1, [27, 28, 29])
                    this.addAnim('down', 0.1, [3, 4, 5])
                    this.addAnim('left', 0.1, [15, 16, 17])
                    this.addAnim('up', 0.1, [39, 40, 41])
                    this.addAnim('down_stop', 0.1, [3])
                }
                    
                this.currentAnim = this.anims.down_stop
            }
            , update: function() {
                this.parent()
                
                if (!this.handlesInput) return
                
                var moved = false
                var dirX = 0
                var dirY = 0
                var newX = 0
                var newY = 0
                
                if (ig.input.pressed('left')) {
                    dirX = -this.tileSize
                    this.currentAnim = this.anims.left
                    this.timePressed = -5
                } else if (ig.input.pressed('right')) {
                    dirX = this.tileSize
                    this.currentAnim = this.anims.right
                    this.timePressed = -5
                } else if (ig.input.pressed('up')) {
                    dirY = -this.tileSize
                    this.currentAnim = this.anims.up
                    this.timePressed = -5
                } else if (ig.input.pressed('down')) {
                    dirY = this.tileSize
                    this.currentAnim = this.anims.down
                    this.timePressed = -5
                }
                
                if (ig.input.pressed('bomb') && this.bombs) {
                    ig.game.spawnEntity(EntityBomb, this.pos.x, this.pos.y)
                    --this.bombs
                }
                
                moved = dirX !== 0 || dirY !== 0
                
                if (moved) {
                    newX = this.pos.x + dirX
                    newY = this.pos.y + dirY

                    // Background colisions
                    if (ig.game.collisionMap.getTile(newX, newY)) {
                        this.pos.x = newX
                        this.pos.y = newY
                        
                        this.broadcastMessage('move')
                    }
                }
            }
        })
    })

;