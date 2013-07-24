ig.module('game.levels.generator')
    .requires(
          'plugins.generaotr.core'
        , 'plugins.generaotr.builders.cellular'
        , 'game.entities.player'
        , 'game.entities.base'
        , 'game.entities.potion'
    )
    .defines(function() {
        var generator = new ig.Generaotr()
        generator.setOptions({
              "width": ig.width
            , "height": ig.height
            , "tilesetName": "media/img/sprite.png"
            , "tilesize": ig.tileSize
        })
        /**
            Generaotr @TODO lists
            =====================
        
            @TODO builders
            [X] Add simple arena builder
            [X] Add cellular builder from ROT
            [ ] Add maze builders from ROT
            [ ] More simplified arenas
            [ ] Gradient sorting for terrain clusters
                for determinate/generate highest cluster vertex
            [ ] Clean code
            [ ] Add unit tests (hope I will..)
        
            @TODO terraing shortcuts and bundles
            [X] Random terrain tilesets
            [ ] Tilesets chaining
            [ ] User condition based tileset selection
            [X] Group shortcut by type
            [X] Ability to use fallback in shortcut group
            [ ] Weight-based fallback
            [ ] Several tiles in one shortcut
            [ ] Factor randomization for shrtcut bundle selection
            
            @TODO entites lists
            [ ] Bind entity position to other object
            [ ] Bind customization eg. over, left side, bottom, etc
            [X] Repeat insertion by specified count
            [X] Entity position in tile
            [X] Random position
            [ ] Pseudo-random (aligned to side) position
            [ ] Position relative offset from last inserted position
            [ ] Position relative offset from last inserted element of same type
            [*] Radial search for empty cell if specified is non-free
        */
        var terrains = [
            {
                // Sand
                "ground": 4
                , "solid:low": 30
                , "solid:middle": 29
                , "solid:highest": 31
            }, {
                // Forest
                "ground": 6
                , "solid:low": 28
                , "solid:middle": 27
                , "solid:highest": 20
            }, {
                // Stone
                "ground": 16
                , "solid:low": 9
                , "solid:middle": 12
                , "solid:highest": 23
            }, {
                // Snow
                "ground": 5
                , "solid:low": 26
                , "solid:middle": 19
                , "solid:highest": 18
            }
        ]
        generator.setMaterials(terrains)
        var bombCount = Math.floor((generator.getOptions('width') + generator.getOptions('height')) / 2)
        generator.setEntities([
            {"type":"EntityBase", "tx":1, "ty":1}
            , {"type":"EntityBase", "tx":118, "ty":38}
            , {"type":"EntityPlayer", "tx":1, "ty": 1}
            , {"type":"EntityPotion", "count": bombCount}
        ])
        
        ig.LevelGenerator = generator.build(ig.BuilderCellular)
    })
;