import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/layout/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SityogCanteen – Order Delicious Food From Sityog Canteen",
  description: "Modern campus canteen food ordering platform with real-time order tracking.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
