import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const antonio = localFont({
  src: "../../public/fonts/Antonio/Antonio-VariableFont_wght.ttf",
  variable: "--font-antonio",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sadhna Mehta - A Painted Journey",
  description: "An immersive, interactive scroll-driven art gallery in 3D positive Z-axis, showcasing fine portraits, landscapes, and abstracts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={antonio.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
