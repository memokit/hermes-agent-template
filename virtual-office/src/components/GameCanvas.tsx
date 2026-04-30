'use client';

import { useEffect, useRef } from 'react';
import { OfficeScene } from '../game/OfficeScene';

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);

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
        scene: OfficeScene,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      };

      // @ts-ignore
      gameRef.current = new Phaser.Game(config);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-gray-900">
      <div className="absolute top-0 left-0 right-0 z-10 bg-gray-800 bg-opacity-90 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">🏢 Virtual Office</h1>
          <p className="text-sm text-gray-300">Phase 1+2: Pixel Art + NPC System</p>
        </div>
        <div className="text-sm text-gray-400">
          Use WASD or Arrow Keys to move | Press E to interact
        </div>
      </div>
      <div ref={containerRef} className="pt-16" />
    </div>
  );
}
