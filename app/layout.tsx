import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { headers } from "next/headers";
import ClientLayout from "./client-layout";
import AuthHydrator from "@/components/AuthHydrator";
import ToastProvider from "@/ui/ToastProvider";

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
      <head>
        {/* Add TezGateway Script Here */}
        <script
          src="https://tezgateway.com/pages/tezgateway_cdn.v1.js"
          type="text/javascript"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ClientLayout>
            <AuthHydrator />
            {children}
            <ToastProvider />
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
