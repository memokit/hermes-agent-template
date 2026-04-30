'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function GameCanvas() {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      backgroundColor: '#2d3436',
      scene: {
        preload: function () {
          // Load pixel art sprites
          this.load.image('player', '/sprites/player.png');
          this.load.image('npc1', '/sprites/npc_red.png');
          this.load.image('floor', '/sprites/floor.png');
          this.load.image('desk', '/sprites/desk.png');
        },
        create: function () {
          // Add floor
          for (let x = 0; x < 800; x += 32) {
            for (let y = 0; y < 600; y += 32) {
              this.add.image(x, y, 'floor');
            }
          }

          // Add desks
          this.add.image(200, 200, 'desk');
          this.add.image(400, 300, 'desk');
          this.add.image(600, 200, 'desk');

          // Add player (you)
          const player = this.add.sprite(400, 300, 'player');
          player.setInteractive();
          this.input.setDraggable(player);

          // Add NPCs
          const npc1 = this.add.sprite(200, 200, 'npc1');
          npc1.setInteractive();
          
          // Add text labels
          this.add.text(200, 230, 'NPC - Luffy', { font: '14px Arial', color: '#ffffff' });
          this.add.text(400, 330, 'You', { font: '14px Arial', color: '#ffff00' });

          // Simple movement for player
          this.input.on('pointerdown', (pointer: any) => {
            player.setPosition(pointer.x, pointer.y);
          });

          // Add office title
          this.add.text(400, 50, '🏢 Hermes Virtual Office', {
            font: '24px Arial',
            color: '#ffffff',
            backgroundColor: '#00000088',
            padding: { x: 10, y: 5 }
          }).setOrigin(0.5);
        }
      }
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div ref={gameRef} className="border-4 border-purple-500 rounded-lg shadow-2xl" />
    </div>
  );
}
