'use client';

import { useEffect, useRef } from 'react';

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load Phaser from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js';
    script.onload = () => {
      // @ts-ignore
      const Phaser = window.Phaser;
      
      const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: containerRef.current,
        backgroundColor: '#1a202c',
        physics: {
          default: 'arcade',
          arcade: { gravity: { y: 0 }, debug: false },
        },
        scene: {
          preload: function() {},
          create: function() {
            // วาดพื้น Office
            const graphics = this.add.graphics();
            graphics.fillStyle(0x2d3748, 1);
            graphics.fillRect(0, 0, 2000, 2000);

            // Grid
            graphics.lineStyle(1, 0x4a5568, 0.3);
            for (let x = 0; x <= 2000; x += 32) {
              graphics.lineBetween(x, 0, x, 2000);
            }
            for (let y = 0; y <= 2000; y += 32) {
              graphics.lineBetween(0, y, 2000, y);
            }

            // โต๊ะ
            graphics.fillStyle(0x8b4513, 1);
            graphics.fillRect(200, 150, 128, 64);
            graphics.fillRect(500, 300, 128, 64);

            // Player
            const player = this.add.rectangle(100, 100, 24, 24, 0x3b82f6);
            this.physics.add.existing(player);
            player.body.setCollideWorldBounds(true);
            player.body.setDrag(300);
            player.body.setMaxVelocity(200);

            // Camera
            this.cameras.main.startFollow(player);
            this.cameras.main.setBounds(0, 0, 2000, 2000);
            this.cameras.main.setZoom(2);

            // Input
            this.cursors = this.input.keyboard.createCursorKeys();
            this.wasd = {
              up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
              down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
              left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
              right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            };
            this.player = player;
          },
          update: function() {
            if (!this.player || !this.player.body) return;
            const body = this.player.body;
            const speed = 150;
            body.setVelocity(0);

            if (this.cursors.left.isDown || this.wasd.left.isDown) body.setVelocityX(-speed);
            if (this.cursors.right.isDown || this.wasd.right.isDown) body.setVelocityX(speed);
            if (this.cursors.up.isDown || this.wasd.up.isDown) body.setVelocityY(-speed);
            if (this.cursors.down.isDown || this.wasd.down.isDown) body.setVelocityY(speed);
          }
        },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      };

      // @ts-ignore
      new Phaser.Game(config);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-gray-900">
      <div className="absolute top-0 left-0 right-0 z-10 bg-gray-800 bg-opacity-90 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">🏢 Virtual Office</h1>
          <p className="text-sm text-gray-300">Prototype - Pixel Art Office</p>
        </div>
      </div>
      <div ref={containerRef} className="pt-16" />
    </div>
  );
}
