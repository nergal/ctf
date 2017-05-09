import {Matrix} from '../matrix';

export class BuilderAbstract {
    constructor(layer) {
        this.layer = layer;

        // Shortcut
        this.width = this.layer.getOptions('width');
        this.height = this.layer.getOptions('height');

        this.map = new Matrix(this.width, this.height);

        this.init();
    }

    correction(x, y, size) {
        // const a = this.map.radialSearch(x, y, size);
        return {x, y};
    }

    getMaterial(selector) {
        return this.layer.getMaterial(selector);
    }

    getMatrix() {
        return new Matrix(
            this.width,
            this.height,
            this.getMaterial('ground')
        );
    }

    getBackground() {
        return this.getMatrix().toArray();
    }

    getOverlay() {
        let message = 'Method BuilderAbstract.getOverlay() must be ';
        message+= 'overrided by child instance. Do not instance ';
        message+= 'this class directly.';

        throw message;
    }

    getCollision() {
        let message = 'Method BuilderAbstract.getCollision() must be ';
        message+= 'overrided by child instance. Do not instance ';
        message+= 'this class directly.';

        throw message;
    }
}
