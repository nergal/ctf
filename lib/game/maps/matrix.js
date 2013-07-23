var Matrix = function(x, y) {
    y = y || x
    this._array = this.createFilledArray(x, y, 0)
    this._size = {
        width: this._array[0].length
        , height: this._array.length
    }
}

Matrix.prototype.createFilledArray = function(x, y, fill) {
    fill = fill || 0
    var rv = []
    for (var i = 0; i < x; i++) {
        rv[i] = []
        for (var j = 0; j < y; j++) {
            rv[i][j] = fill;
        }
    }

    return rv
}

Matrix.prototype.swapValues = function(x1, y1, x2, y2) {
    var source = this.getValueAt(x1, y1)
        , dest = this.getValueAt(x2, y2)

    if (source && dest) {
        this.setValueAt(x1, y1, dest)
        this.setValueAt(x2, y2, source)
    }
}

Matrix.prototype.getValueAt = function(i, j) {
    if (!this._isInBounds(i, j)) {
        return null
    }
    return this._array[i][j]
}

Matrix.prototype.setValueAt = function(i, j, value) {
    if (!this._isInBounds(i, j)) {
        throw Error('Index out of bounds')
    }
    this._array[i][j] = value
}

Matrix.prototype._isInBounds = function(i, j) {
    return i >= 0 && i < this._size.height && j >= 0 && j < this._size.width
}

Matrix.prototype.forEach = function(fn, opt_obj) {
    for (var i = 0; i < this._size.height; i++) {
        for (var j = 0; j < this._size.width; j++) {
            fn.call(this, this._array[i][j], i, j);
        }
    }
}

Matrix.prototype.toArray = function() {
    return this._array;
}

Matrix.prototype.toString = function() {
    var sb = []
    for (var x = 0, xlen = this._array.length; x < xlen; x++) {
        sb.push('[')
        for (var y = 0, ylen = this._array[x].length; y < ylen; y++) {
            var strval = String(this._array[x][y])
            sb.push(strval)
        }
        sb.push(']\n')
    }

    return sb.join('')
}

Matrix.prototype.randomize = function(raito) {
    this.forEach(function(val, x, y) {
        var value = Math.floor(Math.random() * raito)
        this.setValueAt(x, y, value)
    })
}

Matrix.prototype.growth = function() {
    
}

// --------------------

var map = new Matrix(40)
map.randomize(2)
map.growth()
console.log(map.toString())