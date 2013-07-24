ig.module('plugins.generaotr.builders.abstract')
    .requires(
        'impact.impact'
        , 'plugins.generaotr.matrix'
    )
    .defines(function() {
        ig.BuilderAbstract = ig.Class.extend({
            layer: null
            , map: null
            
            , width: null
            , height: null
            
            , init: function(layer) {
                this.layer = layer
                
                // Shortcut
                this.width = this.layer.getOptions('width')
                this.height = this.layer.getOptions('height')
                
                this.map = new ig.Matrix(this.width, this.height)
                this._init()
            }
            , correction: function(x, y, size) {
                var a = this.map.radialSearch(x, y, size)
                return {x: x, y: y}
            }
            , getMaterial: function(selector) {
                return this.layer.getMaterial(selector)
            }
            , getBackground: function() {
                return new ig.Matrix(this.width, this.height, this.getMaterial('ground')).toArray()
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