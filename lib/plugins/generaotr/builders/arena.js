ig.module('plugins.generaotr.builders.arena')
    .requires(
        'impact.impact'
        , 'plugins.generaotr.builders.abstract'
    )
    .defines(function() {
        ig.BuilderArena = ig.BuilderAbstract.extend({
            _init: function() {
                this.map = new ig.Matrix(
                    this.layer.getOptions('width')
                    , this.layer.getOptions('height')
                )
                this.map.forEach(function(value, x, y) {
                    if (x == 0 || y == 0) this.setValueAt(x, y, 9)
                    if ((x == this._size.x - 1) || (y == this._size.y - 1)) {
                        this.setValueAt(x, y, 9)
                    }
                })
            }
            , getOverlay: function() {
                return this.map.toArray()
            }
            , getCollision: function() {
                return this.map.gray().toArray()
            }
        })
    })
;