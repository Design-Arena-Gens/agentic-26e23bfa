import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Lip-Sync Avatar Generator",
  description: "Create animated avatars with AI-powered lip-sync and facial expressions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
