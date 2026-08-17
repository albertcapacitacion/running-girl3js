import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Running Girl",
  description: "A reaction runner game through a colorful park.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
