require('pixi');
require('p2');
const Phaser = require('phaser');

import * as _ from 'lodash';
import {LevelGenerator} from './levels/generator';

class Game {
    constructor(width, height) {
        this.game = new Phaser.Game(
            width,
            height,
            Phaser.AUTO,
            'phaser-example',
            {
                preload: this.preload,
                create: this.create,
                update: this.update,
                render: this.render,
            }
        );
    }

    preload() {
        this.game.load.image(
            'tiles',
            'assets/tilemaps/tiles/tileset.png'
        );
        this.game.load.spritesheet('players', 'assets/sprites/players.png', 32, 32);
    }

    create() {
        const generator = new LevelGenerator(100, 80);
        const jsonData = {
            layers: [],
            orientation: "orthogonal",
            height: 20,
            width: 20,
            tilewidth: 32,
            tileheight: 32,
            version: 1,
            properties: {},
            renderorder: 'right-down',
            nextobjectid: 1,
            tilesets:[{
                firstgid: 1,
                image: '/assets/tilemaps/tiles/tileset.png',
                imageheight:576,
                imagewidth:265,
                margin:0,
                name: 'tiles',
                properties: {},
                spacing:0,
                tileheight:32,
                tilewidth:32
            }]
        };

        for (const layer of generator.level.layer) {
            jsonData.layers.push({
                data: _.flatten(layer.data),
                width: layer.width,
                height: layer.height,
                name: layer.name,
                opacity: 1,
                type: 'tilelayer',
                visible: !!layer.visible,
                x: 0,
                y: 0
            });
        }

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.cache.addTilemap('dynamicMap', null, jsonData, Phaser.Tilemap.TILED_JSON);
        this.map = this.game.add.tilemap('dynamicMap');
        this.map.addTilesetImage('tiles');

        this.map.createLayer('background');
        this.map.createLayer('main');

        this.layer = this.map.createLayer('collision');
        this.map.setCollisionByExclusion([], true, this.layer);
        this.layer.resizeWorld();

        this.layer.debug = true;

        this.player = this.game.add.sprite(32, 32, 'players', 1);
        this.player.animations.add('left', [12,13,14], 10, true);
        this.player.animations.add('right', [24,25,26], 10, true);
        this.player.animations.add('up', [36,37,38], 10, true);
        this.player.animations.add('down', [0,1,2], 10, true);
        this.player.animations.add('stop', [0], 10, true);
        this.player.collideWorldBounds = true;

        this.game.physics.enable(this.player);
        this.game.camera.follow(this.player);

        this.cursors = this.game.input.keyboard.createCursorKeys();
    }

    update() {
        const SPEED = 200;
        let player = this.player;

        this.game.physics.arcade.collide(player, this.layer);
        player.body.velocity.set(0);

        if (this.cursors.left.isDown) {
            player.body.velocity.x = SPEED * -1;
            player.play('left');
        } else if (this.cursors.right.isDown) {
            player.body.velocity.x = SPEED;
            player.play('right');
        } else if (this.cursors.up.isDown) {
            player.body.velocity.y = SPEED * -1;
            player.play('up');
        } else if (this.cursors.down.isDown) {
            player.body.velocity.y = SPEED;
            player.play('down');
        } else {
            player.play('stop');
        }
    }

    render() {
        this.game.debug.bodyInfo(this.player, 32, 32);
    }
}

new Game(800, 600);
