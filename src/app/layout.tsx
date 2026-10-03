import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Providers } from "@/components/Providers";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PothoBooth 📸 | Photo Booth Online Paling Seru!",
  description: "Foto seru dengan template lucu! Login, bayar, pilih template, dan foto sepuasnya!",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-confetti">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-white/80 border-t border-pink-100 py-6 text-center text-sm text-gray-500">
            <p>© 2024 PothoBooth 📸 | Made with 💖</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
