import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "OneMatch - Learn DeFi Through Gaming",
  description: "Match cards, learn OneChain concepts, and earn NFT rewards!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-navy min-h-screen" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
