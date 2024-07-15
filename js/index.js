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

    function preload() {
        console.log("preload");
        this.load.spritesheet('player', 'img/spritesheet/player_movement.png', {
            frameWidth: 48,
            frameHeight: 48
        });
    }

    function create() {
        console.log("create");

        player = this.physics.add.sprite(400, 300, 'player');
        player.setCollideWorldBounds(true);

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
