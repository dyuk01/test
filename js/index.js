document.addEventListener('DOMContentLoaded', function() {
    console.log("index.js loaded");

    var config = {
        type: Phaser.AUTO,
        parent: 'game',
        width: window.innerWidth,
        height: window.innerHeight,
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    };

    var game = new Phaser.Game(config);
    var player;
    var cursors;
    var map;
    var layers = {};

    function preload() {
        console.log("preload");

        this.load.spritesheet('player', 'img/spritesheet/player_movement.png', {
            frameWidth: 48,
            frameHeight: 48
        });

        this.load.tilemapTiledJSON('map', 'asset/map/main_map.tmj');

        this.load.image('tile_cave_floor', 'asset/map/tileset/cave_floor.png');
        this.load.image('tile_cave_ladder', 'asset/map/tileset/cave_ladder.png');
        this.load.image('tile_cave_wall', 'asset/map/tileset/cave_wall.png');
        this.load.image('tile_farm', 'asset/map/tileset/farm.png');
        this.load.image('tile_furniture', 'asset/map/tileset/furniture.png');
        this.load.image('tile_grass', 'asset/map/tileset/grass.png');
        this.load.image('tile_hills', 'asset/map/tileset/hills.png');
        this.load.image('tile_house', 'asset/map/tileset/house.png');
        this.load.image('tile_path', 'asset/map/tileset/path.png');
        this.load.image('tile_tree', 'asset/map/tileset/tree.png');
        this.load.image('tile_water', 'asset/map/tileset/water.png');
        this.load.image('tile_rock', 'asset/map/tileset/rock.png'); 
    }

    function create() {
        console.log("create");

        try {
            map = this.make.tilemap({ key: 'map' });
            console.log("Map loaded:", map);

            var caveFloorTileset = map.addTilesetImage('cave_floor', 'tile_cave_floor');
            var caveLadderTileset = map.addTilesetImage('cave_ladder', 'tile_cave_ladder');
            var caveWallTileset = map.addTilesetImage('cave_wall', 'tile_cave_wall');
            var farmTileset = map.addTilesetImage('farm', 'tile_farm');
            var furnitureTileset = map.addTilesetImage('furniture', 'tile_furniture');
            var grassTileset = map.addTilesetImage('grass', 'tile_grass');
            var hillsTileset = map.addTilesetImage('hills', 'tile_hills');
            var houseTileset = map.addTilesetImage('house', 'tile_house');
            var pathTileset = map.addTilesetImage('path', 'tile_path');
            var treeTileset = map.addTilesetImage('tree', 'tile_tree');
            var waterTileset = map.addTilesetImage('water', 'tile_water');
            var rockTileset = map.addTilesetImage('rock', 'tile_rock');

            console.log("Tilesets loaded:", {
                caveFloorTileset,
                caveLadderTileset,
                caveWallTileset,
                farmTileset,
                furnitureTileset,
                grassTileset,
                hillsTileset,
                houseTileset,
                pathTileset,
                treeTileset,
                waterTileset,
                rockTileset
            });

            layers['water'] = map.createLayer('water', [waterTileset], 0, 0);
            console.log("Water layer created:", layers['water']);

            layers['land'] = map.createLayer('land', [grassTileset], 0, 0);
            console.log("Land layer created:", layers['land']);

            layers['land_deco'] = map.createLayer('land_deco', [grassTileset], 0, 0);
            console.log("Land Deco layer created:", layers['land_deco']);

            layers['house_floor'] = map.createLayer('house_floor', [houseTileset, pathTileset], 0, 0);
            console.log("House Floor layer created:", layers['house_floor']);

            layers['house_wall'] = map.createLayer('house_wall', [houseTileset], 0, 0);
            console.log("House Wall layer created:", layers['house_wall']);

            layers['hill'] = map.createLayer('hill', [hillsTileset], 0, 0);
            console.log("Hill layer created:", layers['hill']);

            layers['trees'] = map.createLayer('trees', [treeTileset], 0, 0);
            console.log("Trees layer created:", layers['trees']);

            layers['farm'] = map.createLayer('farm', [farmTileset], 0, 0);
            console.log("Farm layer created:", layers['farm']);

            layers['mine'] = map.createLayer('mine', [caveLadderTileset], 0, 0);
            console.log("Mine layer created:", layers['mine']);

            layers['plants'] = map.createLayer('plants', [grassTileset, treeTileset], 0, 0);
            console.log("Plants layer created:", layers['plants']);

            layers['furniture'] = map.createLayer('furniture', [furnitureTileset], 0, 0);
            console.log("Furniture layer created:", layers['furniture']);

            // Set collisions for layers if needed
            Object.values(layers).forEach(layer => {
                if (layer) {
                    layer.setCollisionByExclusion([-1]);
                    console.log("Collision set for layer:", layer);
                } else {
                    console.log("Layer is undefined:", layer);
                }
            });

            // Create the player
            player = this.physics.add.sprite(370, 430, 'player');
            player.setCollideWorldBounds(true);
            console.log("Player created:", player);

            // Enable collision between the player and the layers
            Object.values(layers).forEach(layer => {
                if (layer) {
                    this.physics.add.collider(player, layer);
                    console.log("Collider added for layer:", layer);
                } else {
                    console.log("Layer is undefined:", layer);
                }
            });

            // Create player animations
            this.anims.create({
                key: 'moveSouth',
                frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'moveNorth',
                frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'moveWest',
                frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'moveEast',
                frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
                frameRate: 10,
                repeat: -1
            });

            // Set up cursor keys
            cursors = this.input.keyboard.addKeys({
                up: Phaser.Input.Keyboard.KeyCodes.W,
                down: Phaser.Input.Keyboard.KeyCodes.S,
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D
            });

            // Set up the camera to follow the player and zoom in
            this.cameras.main.startFollow(player);
            this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
            this.cameras.main.setZoom(3);  // Adjust the zoom level as needed

            // Center the camera viewport within the canvas
            var viewportWidth = config.width;
            var viewportHeight = config.height;
            this.cameras.main.setViewport(0, 0, viewportWidth, viewportHeight);

        } catch (error) {
            console.error("An error occurred during create:", error);
        }
    }

    function update() {
        player.setVelocity(0);

        if (cursors.left.isDown) {
            player.setVelocityX(-100);
            player.anims.play('moveWest', true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(100);
            player.anims.play('moveEast', true);
        } else if (cursors.up.isDown) {
            player.setVelocityY(-100);
            player.anims.play('moveNorth', true);
        } else if (cursors.down.isDown) {
            player.setVelocityY(100);
            player.anims.play('moveSouth', true);
        } else {
            player.anims.stop();
        }
    }
});
