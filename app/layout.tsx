import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: process.env.APP_NAME ? `${process.env.APP_NAME} Console` : "Cintex Console",
  description: "Cintex by RockStandard — Diagnostics • Service • Knowledge Base",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
