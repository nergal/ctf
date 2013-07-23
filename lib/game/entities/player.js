ig.module('game.entities.player')
    .requires(
        'game.entities.creature'
        , 'game.entities.bomb'
        , 'plugins.fov'
    )
    .defines(function() {    
        EntityPlayer = EntityCreature.extend({            
            collides: ig.Entity.COLLIDES.ACTIVE
            , type: ig.Entity.TYPE.A
            , checkAgainst: ig.Entity.TYPE.B
            , zIndex: 10
            , size: {x: ig.tileSize, y: ig.tileSize}
            , gridSpeed: {x: 50, y: 50}
            , name: "Player"
            , timePressed: 0
            , repeatWait: 0
            , fov: null
            , tileSize: ig.tileSize
            
            , animSheet: new ig.AnimationSheet('media/img/players.png', ig.tileSize, ig.tileSize)
            
            , init: function(x, y, settings) {
                this.parent(x, y, settings)
                
                this.addAnim('right', 0.1, [24, 25, 26])
                this.addAnim('down', 0.1, [0, 1, 2])
                this.addAnim('left', 0.1, [12, 13, 14])
                this.addAnim('up', 0.1, [36, 37, 38])
                this.addAnim('down_stop', 0.1, [0])
                
                this.currentAnim = this.anims.down_stop
                
                this.fov = new FOV(this, 5)
            }
            
            , getOptions: function() {
                return {
                    time: 40
                    , timeLabel: '19:20'
                    , nrg: 92
                    , nrgLabel: 'Энергия'
                    , xp: 66
                    , xpLabel: 'Опыт'
                }
            }
            
            , act: function() {
                ig.game.engine.lock()
                this.fov.compute()
            }
            
            , update: function() {
                this.parent()
                
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
                
                if (ig.input.pressed('bomb')) {
                    console.log('bomb planted')
                    ig.game.spawnEntity(EntityBomb, this.pos.x, this.pos.y)
                }
                
                moved = dirX !== 0 || dirY !== 0
                
                if (moved) {
                    newX = this.pos.x + dirX
                    newY = this.pos.y + dirY
                    if (ig.game.passableTile(Math.floor(newX / this.tileSize), Math.floor(newY / this.tileSize))) {
                        this.pos.x = newX
                        this.pos.y = newY
                        
                        this.broadcastMessage('move')
                    }
                    ig.game.engine.unlock()
                }
            }
            
            , check: function(other) {
                this.parent(other)
            }
        
        })
    })

;