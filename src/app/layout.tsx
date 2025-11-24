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
        {/* Contenedor a pantalla completa */}
        <div className="min-h-screen flex flex-col">
          {/* Header a ancho completo */}
          <header className="w-full border-b border-slate-800">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
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
            </div>
          </header>

          {/* Contenido centrado */}
          <main className="flex-1">
            <div className="max-w-5xl mx-auto px-4 py-6">
              {children}
            </div>
          </main>

          {/* Footer (también a ancho completo con contenido centrado) */}
          <footer className="w-full border-t border-slate-800">
            <div className="max-w-5xl mx-auto px-4 py-3 text-xs text-slate-400">
              Demo frontend · {new Date().getFullYear()}
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
