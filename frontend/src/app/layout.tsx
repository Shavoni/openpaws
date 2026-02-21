import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OpenPaws — AI Social Media Management",
    template: "%s | OpenPaws",
  },
  description:
    "Autonomous AI agents that plan, create, schedule, and analyze your social media content across every platform.",
  keywords: [
    "social media",
    "AI content creation",
    "scheduling",
    "analytics",
    "autonomous agents",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${syne.variable} ${dmSans.variable} font-body antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
