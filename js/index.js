document.addEventListener('DOMContentLoaded', function() {
    console.log("index.js loaded");

    var config = {
        type: Phaser.AUTO,
        parent: 'game',
        width: 800,
        height: 1200,
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: true
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
    var inventory = [];
    var inventorySlots = []; // Define inventorySlots array
    var inventoryText = [];
    const maxInventorySlots = 10; // Define the number of inventory slots
    var inventoryBar;

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
        this.load.image('tile_picnic_basket', 'asset/map/tileset/picnic_basket.png');
        this.load.image('tile_picnic_blanket', 'asset/map/tileset/picnic_blanket.png');
        this.load.image('tile_plants', 'asset/map/tileset/plants.png');
        this.load.image('items', 'asset/map/tileset/items.png');
        this.load.image('tile_well', 'asset/map/tileset/well.png');
        this.load.image('inventory', 'asset/map/tileset/inventory.png'); // Ensure this path is correct
    }

    function create() {
        console.log("create");

        try {
            map = this.make.tilemap({ key: 'map' });
            console.log("Map loaded:", map);

            var waterTileset = map.addTilesetImage('Water', 'tile_water');
            var grassTileset = map.addTilesetImage('grass', 'tile_grass');
            var houseTileset = map.addTilesetImage('house', 'tile_house');
            var hillsTileset = map.addTilesetImage('hills', 'tile_hills');
            var treeTileset = map.addTilesetImage('tree', 'tile_tree');
            var pathTileset = map.addTilesetImage('path', 'tile_path');
            var caveLadderTileset = map.addTilesetImage('cave_ladder', 'tile_cave_ladder');
            var furnitureTileset = map.addTilesetImage('furniture', 'tile_furniture');
            var farmTileset = map.addTilesetImage('farm', 'tile_farm');
            var picnicBlanketTileset = map.addTilesetImage('picnic_blanket', 'tile_picnic_blanket');
            var picnicBasketTileset = map.addTilesetImage('picnic_basket', 'tile_picnic_basket');
            var plantTileset = map.addTilesetImage('plants', 'tile_plants');
            var wellTileset = map.addTilesetImage('well', 'tile_well');

            console.log("Tilesets loaded:", {
                waterTileset,
                grassTileset,
                houseTileset,
                hillsTileset,
                treeTileset,
                pathTileset,
                caveLadderTileset,
                furnitureTileset,
                farmTileset,
                picnicBasketTileset,
                picnicBlanketTileset,
                plantTileset
            });

            layers['water'] = map.createLayer('water', [waterTileset], 0, 0);
            layers['water'].setDepth(0); 
            console.log("Water layer created:", layers['water']);

            layers['land'] = map.createLayer('land', [grassTileset], 0, 0);
            layers['land'].setDepth(1); 
            console.log("Land layer created:", layers['land']);

            layers['land_deco'] = map.createLayer('land_deco', [grassTileset], 0, 0);
            layers['land_deco'].setDepth(1); 
            console.log("Land Deco layer created:", layers['land_deco']);

            layers['house_floor'] = map.createLayer('house_floor', [houseTileset, pathTileset], 0, 0);
            layers['house_floor'].setDepth(2); 
            console.log("House Floor layer created:", layers['house_floor']);

            layers['house_wall'] = map.createLayer('house_wall', [houseTileset], 0, 0);
            layers['house_wall'].setDepth(4); 
            console.log("House Wall layer created:", layers['house_wall']);
 
            layers['picnic_blanket'] = map.createLayer('picnic_blanket', [picnicBlanketTileset], 0, 0);
            layers['picnic_blanket'].setDepth(4); 
            console.log("Picnic Blanket layer created:", layers['picnic_blanket']);           

            layers['picnic_basket'] = map.createLayer('picnic_basket', [picnicBlanketTileset], 0, 0);
            layers['picnic_basket'].setDepth(6);
            console.log("Picnic Basket layer created:", layers['picnic_basket']);        

            layers['hill'] = map.createLayer('hill', [hillsTileset], 0, 0);
            layers['hill'].setDepth(3); 
            console.log("Hill layer created:", layers['hill']);

            layers['trees'] = map.createLayer('trees', [treeTileset], 0, 0);
            layers['trees'].setDepth(6); 
            console.log("Trees layer created:", layers['trees']);

            layers['farm'] = map.createLayer('farm', [farmTileset], 0, 0);
            layers['farm'].setDepth(4); 
            console.log("Farm layer created:", layers['farm']);

            layers['plants'] = map.createLayer('plants', [plantTileset], 0, 0);
            layers['plants'].setDepth(4); 
            console.log("Plants layer created:", layers['plants']);

            layers['well'] = map.createLayer('well', [wellTileset], 0, 0);
            layers['well'].setDepth(4); 
            console.log("Well layer created:", layers['well']);

            layers['mine'] = map.createLayer('mine', [caveLadderTileset], 0, 0);
            layers['mine'].setDepth(4); 
            console.log("Mine layer created:", layers['mine']);

            layers['furniture'] = map.createLayer('furniture', [furnitureTileset], 0, 0);
            layers['furniture'].setDepth(4); 
            console.log("Furniture layer created:", layers['furniture']);

            // Create the player
            player = this.physics.add.sprite(370, 430, 'player');
            player.setCollideWorldBounds(true);
            player.setDepth(5);
            player.body.setSize(player.width * 0.2, player.height * 0.2); 
            
            console.log("Player created:", player);

            // Set up main game camera
            this.cameras.main.startFollow(player);
            this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
            this.cameras.main.setZoom(3);  // Adjust the zoom level as needed

            // Create UI Camera
            const uiCamera = this.cameras.add(0, 0, 800, 1200).setZoom(1);
            uiCamera.ignore(layers['water']);
            uiCamera.ignore(layers['land']);
            uiCamera.ignore(layers['land_deco']);
            uiCamera.ignore(layers['house_floor']);
            uiCamera.ignore(layers['house_wall']);
            uiCamera.ignore(layers['picnic_blanket']);
            uiCamera.ignore(layers['picnic_basket']);
            uiCamera.ignore(layers['hill']);
            uiCamera.ignore(layers['trees']);
            uiCamera.ignore(layers['farm']);
            uiCamera.ignore(layers['plants']);
            uiCamera.ignore(layers['well']);
            uiCamera.ignore(layers['mine']);
            uiCamera.ignore(layers['furniture']);
            uiCamera.ignore(player);

            // Initialize Inventory
            createInventoryUI.call(this, uiCamera);
            
            const obstaclesLayer = map.getObjectLayer('obstacles');
            if (obstaclesLayer) {
                obstaclesLayer.objects.forEach(function(object) {
                    let { x, y, width, height } = object;
            
                    const originAdjustmentX = width / 2; // Adjust if Phaser is using a center origin
                    const originAdjustmentY = height / 2;
            
                    x = x + originAdjustmentX;
                    y = y + originAdjustmentY;
            
                    const obstacle = this.add.rectangle(x, y, width, height);
                    this.physics.world.enable(obstacle, Phaser.Physics.Arcade.STATIC_BODY);
                    obstacle.body.setSize(width, height);
            
                    this.physics.add.collider(player, obstacle);
                }, this);
            }

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

    function createInventoryUI(uiCamera) {
        // Create the inventory bar
        inventoryBar = this.add.image(400, 40, 'inventory'); // Position at top middle
        inventoryBar.setOrigin(0.5, 0); // Center the bar horizontally
        inventoryBar.setDepth(10); // Ensure it is rendered on top of other elements
        
        // Scale inventory bar to fit the screen width
        const scaleFactor = 2; // Adjust this value to make the bar smaller
        inventoryBar.displayWidth = (this.cameras.main.width * scaleFactor) / 3; // Adjust scale as needed
        inventoryBar.displayHeight = inventoryBar.height * scaleFactor; // Keep aspect ratio using scaleFactor
        
        // Define the slot size and position within the inventory bar
        const slotSize = 21 * scaleFactor; // Scale down the slot size
        const padding = 3 * scaleFactor; // Scale down the padding
        const startX = inventoryBar.x - (inventoryBar.displayWidth / 2) + slotSize / 2 + 20; // Start position for slots
        const startY = inventoryBar.y + inventoryBar.displayHeight / 2;
        
        // Create inventory slots
        for (let i = 0; i < maxInventorySlots; i++) {
            const slotX = startX + i * (slotSize + padding);
            const slot = this.add.image(slotX, startY, null); // Empty slot to place items
            slot.setDisplaySize(slotSize, slotSize);
            slot.setDepth(11); // Ensure items are rendered on top of the inventory bar
            inventorySlots.push(slot);
        }
        this.cameras.main.ignore(inventoryBar);
        this.cameras.main.ignore(slot);
        
        // Initialize inventory as empty
        inventory = Array(maxInventorySlots).fill(null);
    }
});
