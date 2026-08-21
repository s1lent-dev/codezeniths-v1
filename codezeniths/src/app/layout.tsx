import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from '@codezeniths/lib/trpc/trpc/trpc.client';
import { Loader } from '@codezeniths/components';
import { Toaster } from '@codezeniths/modules';
import { Suspense } from 'react';
import { ClientSideServiceWorker } from "@codezeniths/lib/firebase";
import FcmListenerProvider from "@codezeniths/lib/firebase/fcm.provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codezeniths",
  description: "Reach Your Zenith",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background-light dark:bg-background-dark">
          <TRPCReactProvider>
              <ClientSideServiceWorker />
              <FcmListenerProvider />
              <Suspense fallback={<div className="fixed inset-0 z-999 flex items-center justify-center bg-background-light dark:bg-background-dark"><Loader /></div>}>
                  {children}
              </Suspense>
              <Toaster />
          </TRPCReactProvider>
      </body>
    </html>
  );
}
