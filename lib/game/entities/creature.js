ig.module('game.entities.creature')
    .requires('impact.entity')
    .defines(function() {
        EntityCreature = ig.Entity.extend({
            experience: 0
            , baseExperience: 0
            
            , init: function(x, y, settings) {
                this.parent(x, y, settings)
            }
            
            , broadcastMessage: function(action, data) {
                data = data || {}
                
                data.remoteId = this.remoteId
                data.pos = this.pos
                
                console.debug(
                    "Action " + action
                     + " in " + this.pos.x + 'x' + this.pos.y
                     + ' by ' + (this.remoteId || ("local:" + this.name))
                )
                if (ig.game.gamesocket) {
                    ig.game.gamesocket.send(action, data)
                }
            }
            
            , act: function() {}
            
            , heal: function(amount, from) {
                this.broadcastMessage('pick')
            }
        })
    })

;