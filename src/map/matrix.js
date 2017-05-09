export class Matrix {
    constructor(x, y = x, fill = 0) {
        this._array = this.createFilledArray(x, y, fill);
        this._size = {
            x: this._array[0].length,
            y: this._array.length,
        };
    }

    createFilledArray(x, y, fill = 0) {
        let rv = [];
        for (let i = 0; i < y; i++) {
            rv[i] = [];
            for (let j = 0; j < x; j++) {
                rv[i][j] = fill;
            }
        }

        return rv;
    }

    swapValues(x1, y1, x2, y2) {
        const source = this.getValueAt(x1, y1);
        const dest = this.getValueAt(x2, y2);

        if (source && dest) {
            this.setValueAt(x1, y1, dest);
            this.setValueAt(x2, y2, source);
        }
    }

    getValueAt(x, y) {
        if (!this._isInBounds(x, y)) {
            return null;
        }

        return this._array[y][x];
    }

    setValueAt(x, y, value) {
        if (!this._isInBounds(x, y)) {
            throw Error('Index out of bounds');
        }

        this._array[y][x] = value;
    }

    _isInBounds(x, y) {
        return (y >= 0 && y < this._size.y) && (x >= 0 && x < this._size.x);
    }

    forEach(fn) {
        for (let y = 0, x; y < this._size.y; y++) {
            for (x = 0; x < this._size.x; x++) {
                fn.apply(this, [this._array[y][x], x, y]);
            }
        }
    }

    toArray() {
        return this._array;
    }

    toString() {
        let sb = [];
        for (let x = 0, xlen = this._array.length; x < xlen; x++) {
            sb.push('[ ');
            for (let y = 0, ylen = this._array[x].length; y < ylen; y++) {
                const strval = String(this._array[x][y]);
                sb.push(strval + ' ');
            }
            sb.push(']\n');
        }

        return sb.join('');
    }

    gray() {
        const base = new Matrix(this._size.x, this._size.y);
        this.forEach((value, x, y) => {
            base.setValueAt(x, y, (value == 0 ? 0 : 1));
        });

        return base;
    }

    randomize(probability) {
        this.forEach((val, x, y) => {
            const value = (Math.random() > probability ? 1 : 0);
            this.setValueAt(x, y, value);
        });
    }

    radialSearch(x, y, size) {
        // const isEmpty = (x, y, size) => { };
        return {x, y};
    }
}
