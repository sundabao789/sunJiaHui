import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "光场面试题",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="w-full h-full flex items-center justify-center">
          {children}
        </div>
      </body>
    </html>
  );
}
