import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Virtual Office - Pixel Art Workspace",
  description: "A pixel art virtual office built with Next.js and Phaser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="h-full m-0 p-0 overflow-hidden">{children}</body>
    </html>
  );
}
