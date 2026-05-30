import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sats DCA",
  description: "Dashboard de DCA em Bitcoin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
