ig.module('game.entities.projection')
    .requires(
        'game.entities.player'
    )
    .defines(function() {    
        EntityProjection = EntityPlayer.extend({            
            name: "Projection"
            , update: function() { }
        })
    })

;