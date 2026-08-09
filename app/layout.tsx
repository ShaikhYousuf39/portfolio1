import type { Metadata } from "next";
import { Erica_One, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ericaOne = Erica_One({
  variable: "--font-erica-one",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Shaikh Yousuf — Web Developer",
  description:
    "Portfolio of Shaikh Yousuf, a full-stack web developer creating thoughtful digital experiences.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ericaOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
