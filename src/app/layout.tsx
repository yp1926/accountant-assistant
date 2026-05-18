import type { Metadata } from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import { Toaster } from "sonner";

import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "TaxNest",
  description:
    "Modern accountant CRM platform for managing clients, reminders and documents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >

      <body
        className={`
          ${geistSans.className}
          ${geistMono.variable}
          bg-white
          text-slate-900
          antialiased
        `}
      >

        {children}

        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            className:
              "rounded-2xl",
          }}
        />

      </body>

    </html>
  );
}