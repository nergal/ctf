export class Generator {
    constructor() {
        this._materials = {};
        this.options = [];
        this._entities = [];

        this.defaultOptions = {
            linkWithCollision: false,
            visible: 1,
            repeat: false,
            preRender: true,
            distance: 1,
            foreground: false,
        };
    }

    _extend(from, dest) {
        const props = Object.getOwnPropertyNames(from);
        props.forEach((name) => {
            const destination = Object.getOwnPropertyDescriptor(from, name);
            Object.defineProperty(dest, name, destination);
        });
        return dest;
    }

    getOptions(key) {
        if (key) {
            return this.options[key] || this.defaultOptions[key];
        }
        return this._extend(this.defaultOptions, this.options);
    }

    setOptions(key, value) {
        if (value) {
            this.options[key] = value;
        } else {
            this.options = this._extend(this.options, key);
        }
    }

    _createLayer(name, data, options = {}) {
        return Object.assign({}, this.getOptions(), options, {name, data});
    }

    setMaterials(materials) {
        if (materials instanceof Array) {
            this._materials = ((arr) => {
                return arr[Math.floor(Math.random() * arr.length)];
            })(materials);
        } else {
            this._materials = materials;
        }
    }

    getMaterial(selector) {
        // selctor format: <type>:<subtype>:<id>
        return this._materials[selector] || (function(query, arr) {
            let parts = query.split(':');

            while (parts.length > 1) {
                parts[parts.length - 1] = '.+?';
                let re = new RegExp('^' + parts.join('\\:') + '$', 'ig');
                for (let i in arr) {
                    if (arr.hasOwnProperty(i) && re.test(i)) {
                        console.warn(
                            `Material "${query}" not found. ` +
                            `Using "${i}" instead`
                        );
                        arr[query] = arr[i];
                        return arr[i];
                    }
                }
                parts.pop();
            }

            const errorMessage = `Material ${query} not found`;
            throw errorMessage;
        })(selector, this._materials);
    }

    /**
     * @param {array} entities
     */
    setEntities(entities) {
        if (entities instanceof Array) {
            for (let i = 0, len = entities.length; i < len; i++) {
                this.setEntities(entities[i]);
            }
        } else {
            if (entities.hasOwnProperty('count')) {
                const count = parseInt(entities.count, 10);
                delete entities['count'];

                for (let i = 0, _ent = {}; i < count; i++, _ent = {}) {
                    // Simple cloning
                    for (let j in entities) {
                        if (entities.hasOwnProperty(j)) {
                            _ent[j] = entities[j];
                        }
                    }
                    this._entities.push(_ent);
                }
            } else {
                this._entities.push(entities);
            }
        }
    }

    /**
     * @param {AbstractBuilder} builder
     * @return {array}
     */
    getEntities(builder) {
        let entities = [];
        for (let i = 0, len = this._entities.length, entity; i < len; i++) {
            entity = this._entities[i];

            if (!entity.hasOwnProperty('x') && !entity.hasOwnProperty('tx')) {
                entity['tx'] = Math.floor(
                    Math.random() * this.getOptions('width')
                );
            }

            if (!entity.hasOwnProperty('y') && !entity.hasOwnProperty('ty')) {
                entity['ty'] = Math.floor(
                    Math.random() * this.getOptions('height')
                );
            }

            if (entity.hasOwnProperty('tx')) {
                entity['x'] = entity['tx'] * this.getOptions('tilesize');
                delete entity['tx'];
            }

            if (entity.hasOwnProperty('ty')) {
                entity['y'] = entity['ty'] * this.getOptions('tilesize');
                delete entity['ty'];
            }

            const newPos = builder.correction(
                entity['x'],
                entity['y'],
                this.getOptions('tilesize')
            );
            entity.x = newPos.x;
            entity.y = newPos.y;

            builder.map.setValueAt(
                entity.x / this.getOptions('tilesize'),
                entity.y / this.getOptions('tilesize'),
                0
            );

            entities.push(entity);
        }

        return entities;
    }

    /**
     * @param {BuilderAbstract} Builder
     * @return {Object}
     */
    build(Builder) {
        const builder = new Builder(this);

        return {
            entities: this.getEntities(builder),
            layer: [
                this._createLayer('background', builder.getBackground()),
                this._createLayer('main', builder.getOverlay()),
                this._createLayer(
                    'collision',
                    builder.getCollision(),
                    {visible: 0}
                ),
            ],
        };
    }
}
