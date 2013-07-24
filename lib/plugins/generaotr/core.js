ig.module('plugins.generaotr.core')
    .requires('impact.impact')
    .defines(function() {
        ig.Generaotr = ig.Class.extend({
            init: function() {
                this.defaultOptions = {
                      "linkWithCollision": false
                    , "visible": 1
                    , "repeat": false
                    , "preRender": true
                    , "distance": 1
                    , "foreground": false
                }
                this.options = {}
                this._entities = []
            }
            , _extend: function(from, dest) {
                var props = Object.getOwnPropertyNames(from)
                props.forEach(function(name) {
                    var destination = Object.getOwnPropertyDescriptor(from, name)
                    Object.defineProperty(dest, name, destination)
                });
                return dest
            }
            , getOptions: function(key) {
                if (key) {
                    return this.options[key] || this.defaultOptions[key]
                }
                return this._extend(this.defaultOptions, this.options)
            }
            , setOptions: function(key, value) {
                if (value) {
                    this.options[key] = value
                } else {
                    this.options = this._extend(this.options, key)
                }
            }
            , _createLayer: function(name, data, options) {
                options = options || {}
                var layer = this._extend(this.getOptions(), options)
                layer['name'] = name
                layer['data'] = data
                return layer
            }
            , setEntities: function(enitites) {
                if (enitites instanceof Array) {
                    this._entities = enitites
                } else {
                    this._entities.push(enitites)
                }
            }
            , build: function(/* BuilderAbstract */ Builder) {
                var builder = new Builder(this)
    
                return {
                    "entities": this._entities
                    , "layer": [
                          this._createLayer("background", builder.getBackground())
                        , this._createLayer("main", builder.getOverlay())
                        , this._createLayer("collision", builder.getCollision(), {
                            visible: 0
                        })
                    ]
                }
            }
        })
    })
;