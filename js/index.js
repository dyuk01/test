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
    // Layers
    var layers = {};

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

        // Create the map
        map = this.make.tilemap({ key: 'map' });
        console.log("Map loaded:", map);

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

        // Create each layer and store them in the layers object
        layers['water'] = map.createLayer('water', [waterTileset], 0, 0);
        layers['land'] = map.createLayer('land', [grassTileset], 0, 0);
        layers['land_deco'] = map.createLayer('land_deco', [grassTileset], 0, 0);
        layers['house_floor'] = map.createLayer('house_floor', [houseTileset, pathTileset], 0, 0);    
        layers['house_wall'] = map.createLayer('house_wall', [houseTileset], 0, 0);    
        layers['hill'] = map.createLayer('hill', [hillsTileset], 0, 0);
        layers['trees'] = map.createLayer('trees', [treeTileset], 0, 0);       
        layers['farm'] = map.createLayer('farm', [farmTileset], 0, 0);  
        layers['mine'] = map.createLayer('mine', [caveLadderTileset], 0, 0);   
        layers['plants'] = map.createLayer('plants', [grassTileset, treeTileset], 0, 0);   
        layers['furniture'] = map.createLayer('furniture', [furnitureTileset], 0, 0);    

        console.log("Layers created:", layers);

        // Set collisions for layers if needed
        Object.values(layers).forEach(layer => {
            layer.setCollisionByExclusion([-1]);
            console.log("Collision set for layer:", layer);
        });

        // Create the player
        player = this.physics.add.sprite(400, 300, 'player');
        player.setCollideWorldBounds(true);
        console.log("Player created:", player);

        // Enable collision between the player and the layers
        Object.values(layers).forEach(layer => {
            this.physics.add.collider(player, layer);
            console.log("Collider added for layer:", layer);
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
        console.log("Cursors set up:", cursors);
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
