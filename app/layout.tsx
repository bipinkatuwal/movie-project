import type { Metadata } from "next";
import { Inter, Sarpanch } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { NavigationBar } from "@/components/navigation-bar";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const sarpanch = Sarpanch({
  variable: "--font-sarpanch",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Spectaculum",
  description: "Movie App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${sarpanch.variable} antialiased font-sans`}
      >
        <NavigationBar />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
