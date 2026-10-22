import type { Metadata } from "next";
import { Epilogue } from "next/font/google";
import "./globals.css";

const epilogue = Epilogue({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-epilogue",
});

export const metadata: Metadata = {
  title: "Postcraft — Admin workspace",
  description:
    "Your email platform, at a glance. Postcraft administration demo.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={epilogue.variable}>
      <body>{children}</body>
    </html>
  );
}
