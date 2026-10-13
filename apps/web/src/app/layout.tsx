import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgileClix ERP",
  description: "Work Smarter. Grow Faster. — ZentoriLabs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
