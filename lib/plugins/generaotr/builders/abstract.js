ig.module('plugins.generaotr.builders.abstract')
    .requires(
        'impact.impact'
        , 'plugins.generaotr.matrix'
    )
    .defines(function() {
        ig.BuilderAbstract = ig.Class.extend({
            layer: null
            , map: null
            , init: function(layer) {
                this.layer = layer
                this._array = new ig.Matrix(
                    this.layer.getOptions('width')
                    , this.layer.getOptions('height')
                )
                this._init()
            }
            , getBackground: function() {
                return this._array.createFilledArray(
                    this.layer.getOptions('width')
                    , this.layer.getOptions('height')
                    , 6
                )
            }
            , getOverlay: function() {
                var message = "Method BuilderAbstract.getOverlay() must be "
                message+= "overrided by child instance. Do not instance "
                message+= "this class directly."
                
                throw message
            }
            , getCollision: function() {
                var message = "Method BuilderAbstract.getCollision() must be "
                message+= "overrided by child instance. Do not instance "
                message+= "this class directly."
                
                throw message
            }
        })
    })
;