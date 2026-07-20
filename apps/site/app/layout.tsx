import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";

import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://topresume.me"),
  title: {
    default: "Top Resume — Build a resume that actually gets read",
    template: "%s · Top Resume",
  },
  description:
    "A block-based resume builder with hand-tuned themes, rich text control, and pixel-perfect PDF & Word export. Free while in alpha.",
  openGraph: {
    title: "Top Resume",
    description:
      "A block-based resume builder with hand-tuned themes, rich text control, and pixel-perfect PDF & Word export.",
    url: "https://topresume.me",
    siteName: "Top Resume",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Resume",
    description:
      "A block-based resume builder with hand-tuned themes, rich text control, and pixel-perfect PDF & Word export.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SmoothScroll />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
