ig.module('plugins.generaotr.core')
    .requires('impact.impact')
    .defines(function() {
        ig.Generaotr = ig.Class.extend({
            _materials: {}
            , options: []
            , _entities: []
            , init: function() {
                this.defaultOptions = {
                      "linkWithCollision": false
                    , "visible": 1
                    , "repeat": false
                    , "preRender": true
                    , "distance": 1
                    , "foreground": false
                }
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
            , setMaterials: function(materials) {
                if (materials instanceof Array) {
                    this._materials = (function(arr) {
                        return arr[Math.floor(Math.random() * arr.length)]
                    })(materials)
                    console.log(this._materials)
                } else {
                    this._materials = materials
                }
            }
            , getMaterial: function(selector) {
                // selctor format: <type>:<subtype>:<id>
                return this._materials[selector] || (function(query, arr) {
                    var parts = query.split(':')
                        , re, i
                    while (parts.length > 1) {
                        parts[parts.length - 1] = '.+?'
                        re = new RegExp('^' + parts.join('\\:') + '$', 'ig')
                        for (i in arr) {
                            if (arr.hasOwnProperty(i) && re.test(i)) {
                                console.warn('Material "' + query + '" not found. Using "' + i + '" instead')
                                arr[query] = arr[i]
                                return arr[i]
                            }
                        }
                        parts.pop()
                    }
                    throw "Material " + query + " not found"
                })(selector, this._materials)
            }
            , setEntities: function(entities) {
                if (entities instanceof Array) {
                    for (var i = 0, len = entities.length; i < len; i++) {
                        this.setEntities(entities[i])
                    }
                } else {
                    if (entities.hasOwnProperty('count')) {
                        var count = parseInt(entities.count, 10)
                        delete entities['count']
                        
                        for (var i = 0, _ent = {}; i < count; i++, _ent = {}) {
                            // Simple cloning
                            for (j in entities) _ent[j] = entities[j]
                            this._entities.push(_ent)
                        }
                    } else {
                        this._entities.push(entities)
                    }
                }
            }
            , getEntities: function() {
                var entities = []
                for (var i = 0, len = this._entities.length, entity; i < len; i++) {
                    entity = this._entities[i]

                    if (!entity.hasOwnProperty('x') && !entity.hasOwnProperty('tx')) {
                        entity['tx'] = Math.floor(Math.random() * this.getOptions('width'))
                    }
                    
                    if (!entity.hasOwnProperty('y') && !entity.hasOwnProperty('ty')) {
                        entity['ty'] = Math.floor(Math.random() * this.getOptions('height'))
                    }
                    
                    if (entity.hasOwnProperty('tx')) {
                        entity['x'] = entity['tx'] * this.getOptions('tilesize')
                        delete entity['tx']
                    }
                    if (entity.hasOwnProperty('ty')) {
                        entity['y'] = entity['ty'] * this.getOptions('tilesize')
                        delete entity['ty']
                    }
                    
                    entities.push(entity)
                }
                
                return entities
            }
            
            /**
             * Build object for ImpactJS
             *
             * @params ig.BuilderAbstract Buider
             * @return object
             */
            , build: function(/* ig.BuilderAbstract */ Builder) {
                var builder = new Builder(this)

                return {
                    "entities": this.getEntities()
                    , "layer": [
                          this._createLayer("background", builder.getBackground()) // Same tile for all cells
                        , this._createLayer("main", builder.getOverlay()) // For transparent sprites
                        , this._createLayer("collision", builder.getCollision(), {visible: 0}) // Collisions, nothins to say
                    ]
                }
            }
        })
    })
;