ig.module('game.levels.generator')
    .requires(
          'plugins.generaotr.core'
        , 'plugins.generaotr.builders.cellular'
    )
    .defines(function() {
        var generator = new ig.Generaotr()
        generator.setOptions({
              "width": ig.config.width
            , "height": ig.config.height
            , "tilesetName": "media/img/sprite.png"
            , "tilesize": ig.config.tileSize
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
                , "solid:0": 30
                , "solid:1": 29
                , "solid:2": 31
            }, {
                // Forest
                "ground": 6
                , "solid:0": 28
                , "solid:1": 27
                , "solid:2": 20
            }, {
                // Stone
                "ground": 16
                , "solid:0": 9
                , "solid:1": 12
                , "solid:2": 23
            }, {
                // Snow
                "ground": 5
                , "solid:0": 26
                , "solid:1": 19
                , "solid:2": 18
            }
        ]
        var _terrains = [{
            "ground": 73
            , "solid:0": 1063
            , "solid:1": 1064
            , "solid:2": 1032
        }]
        generator.setMaterials(terrains)
        var bombCount = Math.floor((generator.getOptions('width') + generator.getOptions('height')) / 2)
        generator.setEntities([
            {"type":"EntityBlueBase", "tx":1, "ty":1}
            , {"type":"EntityRedBase", "tx":ig.config.width - 3, "ty":ig.config.height - 3}
            , {"type":"EntityPlayer", "tx":1, "ty": 1}
            , {"type":"EntityPotion", "count": bombCount}
        ])
        
        ig.LevelGenerator = generator.build(ig.BuilderCellular)
    })
;