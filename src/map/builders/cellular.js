import {BuilderArena} from './arena';
import {Matrix} from '../matrix';

export class BuilderCellular extends BuilderArena {
    init() {
        // @TODO options override
        this._options = {
            born: [5, 6, 7, 8],
            survive: [4, 5, 6, 7, 8],
            topology: 8,
            probability: 0.5,
        };

        this.randomize(this._options.probability);
        this.map = this.create();
    }

    create() {
        const newMap = new Matrix(this.width, this.height);
        const born = this._options.born;
        const survive = this._options.survive;

        for (let j = 0; j < this.map._size.y; j++) {
            let widthStep = 1;
            let widthStart = 0;
            if (this._options.topology == 6) {
                widthStep = 2;
                widthStart = j % 2;
            }

            for (let i = widthStart; i < this.map._size.x; i+= widthStep) {
                let cur = this.map.getValueAt(i, j);
                let ncount = this._getNeighbors(i, j);

                if (cur && survive.indexOf(ncount) != -1) { /* survive */
                    newMap.setValueAt(i, j, this.getMaterial('solid:1'));
                } else if (!cur && born.indexOf(ncount) != -1) { /* born */
                    newMap.setValueAt(i, j, this.getMaterial('solid:0'));
                }
            }
        }

        return newMap;
    }

    _getNeighbors(cx, cy) {
        let result = 0;
        for (
            let i = 0;
            i < BuilderCellular.topology[this._options.topology].length;
            i++
        ) {
            const dir = BuilderCellular.topology[this._options.topology][i];
            const x = cx + dir[0];
            const y = cy + dir[1];

            if (
                x < 0 || x >= this.map._size.x || x < 0 || y >= this.map._size.x
            ) continue;
            result += (this.map.getValueAt(x, y) == 0 ? 0 : 1);
        }

        return result;
    }

    randomize(probability) {
        this.map.randomize(probability);
        return this;
    }
}

BuilderCellular.topology = {
    '4': [[0, -1], [1, 0], [0, 1], [-1, 0]],
    '8': [
        [0, -1], [1, -1], [1, 0], [1, 1],
        [0, 1], [-1, 1], [-1, 0], [-1, -1],
    ],
    '6': [[-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1], [-2, 0]],
};
