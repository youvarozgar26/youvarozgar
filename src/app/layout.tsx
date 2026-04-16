import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Youvarozgar - नौकरी ढूंढना अब हुआ आसान",
  description: "Mumbai and Maharashtra's dedicated job platform for blue-collar workers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton />
        <BottomNav />
      </body>
    </html>
  );
}
