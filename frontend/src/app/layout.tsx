import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vocabeat - Smart Vocabulary Learning",
  description: "Learn vocabulary from your translation history automatically",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} antialiased`}>
        <div className="relative flex min-h-screen flex-col bg-gradient-secondary">
          <Header />
          <main className="flex-1 pt-24">{children}</main>
        </div>
      </body>
    </html>
  );
}
