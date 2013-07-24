ig.module('plugins.generaotr.matrix')
    .requires(
        'impact.impact'
    )
    .defines(function() {
        ig.Matrix = ig.Class.extend({
            _array: []
            , _size: {x: 0, y: 0}
            , init: function(x, y, fill) {
                y = y || x
                fill = fill || 0
                this._array = this.createFilledArray(x, y, fill)
                this._size = {
                    x: this._array[0].length
                    , y: this._array.length
                }
            }

            , createFilledArray: function(x, y, fill) {
                fill = fill || 0
                var rv = []
                for (var i = 0; i < y; i++) {
                    rv[i] = []
                    for (var j = 0; j < x; j++) {
                        rv[i][j] = fill;
                    }
                }
            
                return rv
            }
            
            , swapValues: function(x1, y1, x2, y2) {
                var source = this.getValueAt(x1, y1)
                    , dest = this.getValueAt(x2, y2)
            
                if (source && dest) {
                    this.setValueAt(x1, y1, dest)
                    this.setValueAt(x2, y2, source)
                }
            }
            
            , getValueAt: function(x, y) {
                if (!this._isInBounds(x, y)) {
                    return null
                }
                return this._array[y][x]
            }
            
            , setValueAt: function(x, y, value) {
                if (!this._isInBounds(x, y)) {
                    throw Error('Index out of bounds')
                }
                this._array[y][x] = value
            }
            
            , _isInBounds: function(x, y) {
                return (y >= 0 && y < this._size.y) && (x >= 0 && x < this._size.x)
            }
            
            , forEach: function(fn) {
                for (var y = 0, x; y < this._size.y; y++) {
                    for (x = 0; x < this._size.x; x++) {
                        fn.apply(this, [this._array[y][x], x, y])
                    }
                }
            }
            
            , toArray: function() {
                return this._array;
            }
            
            , toString: function() {
                var sb = []
                for (var x = 0, xlen = this._array.length; x < xlen; x++) {
                    sb.push('[ ')
                    for (var y = 0, ylen = this._array[x].length; y < ylen; y++) {
                        var strval = String(this._array[x][y])
                        sb.push(strval + ' ')
                    }
                    sb.push(']\n')
                }
            
                return sb.join('')
            }
            
            , gray: function() {
                var base = new ig.Matrix(this._size.x, this._size.y)
                this.forEach(function(value, x, y) {
                    base.setValueAt(x, y, (value == 0 ? 1 : 0))
                })
                return base
            }
            
            , randomize: function(probability) {
                this.forEach(function(val, x, y) {
                    var value = (Math.random() > probability ? 1 : 0)
                    this.setValueAt(x, y, value)
                })
            }
            
            , radialSearch: function(x, y, size) {
                var isEmpty = function(x, y, size) {
                    //if (size ==     
                }
                return {x: x, y: y}
            }
        })
    })
;