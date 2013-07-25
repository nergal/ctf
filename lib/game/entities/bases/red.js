ig.module('game.entities.bases.red')
    .requires(
        'impact.entity'
        , 'game.entities.bases.blue'
    )
    .defines(function() {
        EntityRedBase = EntityBlueBase.extend({
            name: "Red Base"
            , team: 'Red'
        })
    })

;