import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ULTD TRANS | Translation & Localization Platform",
  description: "Professional translation, localization and AI-assisted language services.",
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
