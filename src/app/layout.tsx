import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eco IT session booking App",
  description: "A next js app to keep track of tutorial sessions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      {/*<!--className={`${geistSans.variable} ${geistMono.variable} antialiased`} -->*/}
      <body
        className={cn("min-h-screen,bg-background antialiased",geistSans.variable,geistMono.variable)}
      >
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
