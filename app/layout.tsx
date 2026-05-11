import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SynergyInvest Portal",
  description: "Governance, shareholder, investor, property, and document management portal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
