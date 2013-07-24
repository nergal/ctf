ig.module('plugins.generaotr.builders.cellular')
    .requires(
        'impact.impact'
        , 'plugins.generaotr.builders.arena'
    )
    .defines(function() {
        ig.BuilderCellular = ig.BuilderArena.extend({
            _topology: {
                "4": [[ 0, -1], [ 1,  0], [ 0,  1], [-1,  0]],
                "8": [[ 0, -1], [ 1, -1], [ 1,  0], [ 1,  1], [ 0,  1], [-1,  1], [-1,  0], [-1, -1]],
                "6": [[-1, -1], [ 1, -1], [ 2,  0], [ 1,  1], [-1,  1], [-2,  0]]
            }
            
            , _init: function() {
                // @TODO options override
                this._options = {
                    born: [5, 6, 7, 8],
                    survive: [4, 5, 6, 7, 8],
                    topology: 8
                    , probability: 0.5
                }
                this.randomize(this._options.probability)
                this.map = this.create()
            }
            , create: function() {
                var newMap = new ig.Matrix(this.width, this.height)
                var born = this._options.born;
                var survive = this._options.survive;
            
                for (var j = 0; j < this.map._size.y; j++) {
                    var widthStep = 1;
                    var widthStart = 0;
                    if (this._options.topology == 6) { 
                        widthStep = 2;
                        widthStart = j % 2;
                    }
            
                    for (var i = widthStart; i < this.map._size.x; i+= widthStep) {
                        var cur = this.map.getValueAt(i, j);
                        var ncount = this._getNeighbors(i, j);

                        if (cur && survive.indexOf(ncount) != -1) { /* survive */
                            newMap.setValueAt(i, j, this.getMaterial('solid:middle'))
                        } else if (!cur && born.indexOf(ncount) != -1) { /* born */
                            newMap.setValueAt(i, j, this.getMaterial('solid:low'))
                        }
                    }
                }
                
                return newMap
            }
            , _getNeighbors: function(cx, cy) {
                var result = 0;
                for (var i = 0; i < this._topology[this._options.topology].length;i++) {
                    var dir = this._topology[this._options.topology][i]
                    var x = cx + dir[0]
                    var y = cy + dir[1]
                    
                    if (x < 0 || x >= this.map._size.x || x < 0 || y >= this.map._size.x) { continue }
                    result += (this.map.getValueAt(x, y) == 0 ? 0 : 1)
                }
                
                return result
            }
            , randomize: function(probability) {
                this.map.randomize(probability)
                return this
            }
        })
    })
;