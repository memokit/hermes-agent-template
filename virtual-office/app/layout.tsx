export const metadata = {
  title: 'Virtual Office - Hermes Agent',
  description: 'A pixel art virtual office built with Next.js and Phaser',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900">{children}</body>
    </html>
  );
}
