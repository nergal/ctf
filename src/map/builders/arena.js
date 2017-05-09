import {BuilderAbstract} from './abstract';

export class BuilderArena extends BuilderAbstract {
    init() {
        const material = this.getMaterial('solid:2');

        this.map.forEach(function(value, x, y) {
            if (x == 0 || y == 0) this.setValueAt(x, y, material);
            if ((x == this._size.x - 1) || (y == this._size.y - 1)) {
                this.setValueAt(x, y, material);
            }
        });
    }

    getOverlay() {
        return this.map.toArray();
    }

    getCollision() {
        return this.map.gray().toArray();
    }
}
