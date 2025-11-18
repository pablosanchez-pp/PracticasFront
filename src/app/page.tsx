'use client';

import Link from "next/link";
import { Button } from "antd";

export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Inicio</h1>

      <p className="text-slate-300">
        Este es un pequeño frontend de prueba para practicar Next.js y la
        conexión con tu microservicio de clientes.
      </p>

      <div className="flex gap-3">
        <Link href="/clients">
          <Button type="primary">Clientes</Button>
        </Link>
      </div>

      <div className="flex gap-3">
        <Link href="">
          <Button type="primary">Mercados</Button>
        </Link>
      </div>
    </section>
  );
}
