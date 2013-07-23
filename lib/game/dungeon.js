ig.module('game.dungeon')
    .requires(
        'impact.impact'
    )
    .defines(function() {
        Dungeon = ig.Class.extend({
            scheduler: new ROT.Scheduler.Simple()
            , potionCount: 5
            , backgroundTiles: []
            , collisionTiles: []
            , freeTiles: []

            , entities: []
            , visitedTiles: {}

            , init: function(width, height) {
                this.width = width
                this.height = height
                this.gridSize = ig.game.tileSize

                this.initializeMaps()
                this.generateMap()
                this.generateEntities()
            }
            , load: function() {
                var bgmatrix = []
                for (var i = 0; i < ig.height; i++) {
                    bgmatrix.push(Array.apply(null, new Array(ig.width)).map(Number.prototype.valueOf, 6))
                }
                var bmap = new ig.BackgroundMap(ig.tileSize, bgmatrix, 'media/img/sprite.png')
                bmap.preRender = true
                ig.game.backgroundMaps.push(bmap)

                var fmap = new ig.BackgroundMap(ig.tileSize, this.backgroundTiles, 'media/img/sprite.png')
                fmap.preRender = true
                ig.game.backgroundMaps.push(fmap)

                ig.game.collisionMap = new ig.CollisionMap(ig.tileSize, this.collisionTiles)
            }
            , initializeMaps: function() {
                for (var y = 0, x; y < this.height; y++) {
                    var row1 = [], row2 = []
                    for (x = 0; x < this.width; x++) {
                        row1.push(0)
                        row2.push(1)
                    }
                    this.backgroundTiles[y] = row1
                    this.collisionTiles[y] = row2
                }
            }
            , generateMap: function() {
                var digger = new ROT.Map.Cellular(this.width, this.height)
                digger.randomize(0.5)

                var digCallback = function(x, y, value) {
                    this.collisionTiles[y][x] = value
                    if (value === 0) {
                        this.freeTiles.push({x: x, y: y})
                    } else {
                        this.backgroundTiles[y][x] = 
                        _.first(_.shuffle([9, 10, 11, 12, 129, 130]))
                    }
                }
                digger.create(digCallback.bind(this))
            }
            , generateEntities: function() {
                var index, pos, entity, i, itemName

                // Potions
                for (i = 0; i < this.potionCount; i++) {
                    index = Math.floor(ROT.RNG.getUniform() * this.freeTiles.length)
                    pos = this.freeTiles.splice(index, 1)[0]
                    entity = ig.game.spawnEntity(EntityPotion, pos.x * this.gridSize, pos.y * this.gridSize)
                }

                // Stairs
                index = Math.floor(ROT.RNG.getUniform() * this.freeTiles.length)
                pos = this.freeTiles.splice(index, 1)[0]
                entity = ig.game.spawnEntity(EntityBase, pos.x * this.gridSize, pos.y * this.gridSize)
            }
            , spawnPlayer: function(player) {
                var index = Math.floor(ROT.RNG.getUniform() * this.freeTiles.length)
                var pos = this.freeTiles.splice(index, 1)[0]

                var stairs = ig.game.spawnEntity(EntityBase, pos.x * this.gridSize, pos.y * this.gridSize)
                stairs.currentAnim = stairs.anims.up

                player.pos.x = pos.x * this.gridSize
                player.pos.y = pos.y * this.gridSize
                ig.game.entities.push(player)
                this.scheduler.add(player, true)
            }
        })
    })

;