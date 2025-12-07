import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MakerKit - Building Blocks on Chain",
  description: "On-chain platform for hardware creatives. Clone, produce, earn.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
