'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';

// Dynamically import Phaser game to avoid SSR issues
const GameCanvas = dynamic(() => import('../components/GameCanvas'), {
  ssr: false,
  loading: () => <p className="text-white text-center p-10">Loading Virtual Office...</p>
});

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-gray-900">
      <GameCanvas />
    </main>
  );
}
