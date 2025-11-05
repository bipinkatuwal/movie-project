import type { Metadata } from "next";
import { Inter, Sarpanch } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { NavigationBar } from "@/components/navigation-bar";
import { Suspense } from "react";
import ScrollToTop from "@/components/scroll-to-top";
import { ThemeProvider } from "./providers/theme-provider";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${sarpanch.variable} antialiased font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<div>Loading...</div>}>
            <ScrollToTop />
            <NavigationBar />
            {children}
            <Toaster position="top-right" />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
