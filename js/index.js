document.addEventListener('DOMContentLoaded', function() {
    console.log("index.js loaded");

    var config = {
        type: Phaser.AUTO,
        parent: 'game',
        width: 800,
        height: 600,
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
        }
    };

    var game = new Phaser.Game(config);
    var player;
    var cursors;
    var map;
    var groundLayer;

    function preload() {
        console.log("preload");
        // Load player spritesheet
        this.load.spritesheet('player', 'img/spritesheet/player_movement.png', {
            frameWidth: 48,
            frameHeight: 48
        });
        
        // Load the Tiled map JSON
        this.load.tilemapTiledJSON('map', 'asset/map/main_map.tmj');
        
        // Load all tileset images used in the map
        this.load.image('tile_cave_floor', 'asset/tileset/png/cave_floor.png');
        this.load.image('tile_cave_ladder', 'asset/tileset/png/cave_ladder.png');
        this.load.image('tile_cave_wall', 'asset/tileset/png/cave_wall.png');
        this.load.image('tile_farm', 'asset/tileset/png/farm.png');
        this.load.image('tile_furniture', 'asset/tileset/png/furniture.png');
        this.load.image('tile_grass', 'asset/tileset/png/grass.png');
        this.load.image('tile_hills', 'asset/tileset/png/hills.png');
        this.load.image('tile_house', 'asset/tileset/png/house.png');
        this.load.image('tile_path', 'asset/tileset/png/path.png');
        this.load.image('tile_tree', 'asset/tileset/png/tree.png');
        this.load.image('tile_water', 'asset/tileset/png/water.png');
        this.load.image('tile_rock', 'asset/tileset/png/rock.png');  // Corrected the typo from 'tiel_rock' to 'tile_rock'
    }

    function create() {
        console.log("create");

        // Create the map
        map = this.make.tilemap({ key: 'map' });

        // Add each tileset image to the map
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

        // Create the ground layer
        groundLayer = map.createLayer('Ground Layer', [
            waterTileset
        ], 0, 0);

        groundLayer.setCollisionByExclusion([-1]);

        // Create the player
        player = this.physics.add.sprite(400, 300, 'player');
        player.setCollideWorldBounds(true);

        // Enable collision between the player and the ground layer
        this.physics.add.collider(player, groundLayer);

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
    }

    function update() {
        player.setVelocity(0);

        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            if (player.anims.currentAnim !== this.anims.get('moveWest')) {
                player.anims.play('moveWest', true);
            }
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            if (player.anims.currentAnim !== this.anims.get('moveEast')) {
                player.anims.play('moveEast', true);
            }
        } else if (cursors.up.isDown) {
            player.setVelocityY(-160);
            if (player.anims.currentAnim !== this.anims.get('moveNorth')) {
                player.anims.play('moveNorth', true);
            }
        } else if (cursors.down.isDown) {
            player.setVelocityY(160);
            if (player.anims.currentAnim !== this.anims.get('moveSouth')) {
                player.anims.play('moveSouth', true);
            }
        } else {
            player.anims.stop();
        }
    }
});
