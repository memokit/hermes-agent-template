import Phaser from 'phaser';

export class OfficeScene extends Phaser.Scene {
  constructor() {
    super('OfficeScene');
    this.player = null;
    this.cursors = null;
    this.wasd = null;
  }

  preload() {
    // ในอนาคตจะโหลด Pixel Art Sprites ที่นี่
  }

  create() {
    const camWidth = this.cameras.main.width;
    const camHeight = this.cameras.main.height;
    
    // วาดพื้น Office (สีเทา)
    const graphics = this.add.graphics();
    graphics.fillStyle(0x2d3748, 1);
    graphics.fillRect(0, 0, 2000, 2000);

    // วาดตาราง Grid
    graphics.lineStyle(1, 0x4a5568, 0.3);
    for (let x = 0; x <= 2000; x += 32) {
      graphics.lineBetween(x, 0, x, 2000);
    }
    for (let y = 0; y <= 2000; y += 32) {
      graphics.lineBetween(0, y, 2000, y);
    }

    // วาดโต๊ะทำงาน
    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(200, 150, 128, 64);
    graphics.fillRect(500, 300, 128, 64);
    graphics.fillRect(800, 150, 128, 64);

    // วาดเก้าอี้
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(232, 220, 32, 32);
    graphics.fillRect(532, 370, 32, 32);
    graphics.fillRect(832, 220, 32, 32);

    // สร้าง Player
    this.player = this.add.rectangle(100, 100, 24, 24, 0x3b82f6);
    this.physics.add.existing(this.player);
    
    const playerBody = this.player.body;
    playerBody.setCollideWorldBounds(true);
    playerBody.setBounce(0);
    playerBody.setDrag(300);
    playerBody.setMaxVelocity(200);

    // Camera follow player
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, 2000, 2000);
    this.cameras.main.setZoom(2);

    // Keyboard input
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
    }
  }

  update() {
    if (!this.player || !this.player.body) return;

    const body = this.player.body;
    const speed = 150;

    body.setVelocity(0);

    // Arrow Keys
    if (this.cursors.left.isDown) {
      body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(speed);
    }

    if (this.cursors.up.isDown) {
      body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      body.setVelocityY(speed);
    }

    // WASD
    if (this.wasd.left.isDown) {
      body.setVelocityX(-speed);
    } else if (this.wasd.right.isDown) {
      body.setVelocityX(speed);
    }

    if (this.wasd.up.isDown) {
      body.setVelocityY(-speed);
    } else if (this.wasd.down.isDown) {
      body.setVelocityY(speed);
    }
  }
}
