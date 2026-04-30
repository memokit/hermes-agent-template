/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // สำหรับ Phaser.js ที่โหลดจาก CDN ใน GameCanvas.tsx
  // ไม่ต้อง config เพิ่มเติม
}

module.exports = nextConfig
