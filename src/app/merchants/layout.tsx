import Link from "next/link";

export default function MerchantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold">
            Demo frontend
          </Link>

          <nav className="flex gap-4 text-sm text-slate-300">
            <Link href="/" className="hover:text-blue-400 transition">
              Inicio
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6">{children}</div>
      </main>

      <footer className="w-full border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-3 text-xs text-slate-400">
          Demo frontend · {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
