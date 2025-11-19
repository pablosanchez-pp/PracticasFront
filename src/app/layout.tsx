import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "antd/dist/reset.css";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Demo Frontend",
  description: "Frontend de práctica con Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          bg-slate-800 
          text-slate-100 
          antialiased
        `}
      >
        <div className="min-h-screen max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
          {/* Cabecera muy simple */}
          <header className="flex items-center justify-between border-b border-slate-800 pb-3">
            <Link href="/" className="text-lg font-semibold">
              Demo frontend
            </Link>

            <nav className="flex gap-4 text-sm text-slate-300">
              <Link
                href="/"
                className="hover:text-blue-400 transition"
              >
                Inicio
              </Link>
            </nav>
          </header>

          {/* Contenido de cada página */}
          <main className="flex-1 py-4">
            {children}
          </main>

          {/* Pie de página sencillo */}
          <footer className="border-t border-slate-800 pt-3 text-xs text-slate-400">
            Demo frontend · {new Date().getFullYear()}
          </footer>
        </div>
      </body>
    </html>
  );
}
