import type { Metadata, Viewport } from "next";
import { Albert_Sans, Fragment_Mono } from "next/font/google";
import "./globals.css";

const albertSans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-albert-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  variable: "--font-fragment-mono",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jagan — Building Beyond Possible",
  description: "Portfolio of Jagan — AI product builder and engineer.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${albertSans.variable} ${fragmentMono.variable}`}
      data-scroll-locked="true"
    >
      <body>
        <div className="site-shell">{children}</div>
      </body>
    </html>
  );
}