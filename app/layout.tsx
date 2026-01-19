import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import ClientLayout from "./client-layout";

import TopBar from "@/components/header/TopBar"
import Footer from "@/components/footer/Footer"
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SevaFast",
  description: "Products -Sevafast Online Store",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;

}>) {

  const pathname = (await headers()).get("x-pathname") || "";

  const hideLayout =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
