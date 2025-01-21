// /app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MetadataProvider } from './context/MetadataContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Application Market",
  description: "Application Market is THE go-to website for all of your applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Metadata zoals title en description worden door Next.js gegenereerd */}
        <link rel="icon" href="./images/favicon.ico" />
      </head>
      <body className={inter.className}>
        <MetadataProvider>
          {children}
        </MetadataProvider>
      </body>
    </html>
  );
}
