'use client';

import { useEffect, useState } from 'react';
import Service from '@/service/src';
import type { Client } from '@/domain/client';

const Hola = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    setError(null);

    const llamada = Service.getCases('getClients', {
      signal: signal,
      endPointData: {}, 
      token: process.env.NEXT_PUBLIC_JWT,
    })
      .then((res) => {
        console.log(res);
        const lista = Array.isArray(res) ? (res as Client[]) : [];
        setClients(res as Client[]);
      })
      .catch((err: any) => {
        if (err?.name === 'AbortError') return;
        console.error('ERROR EN getClients:', err);
        setError(String(err?.message ?? err));
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  if (loading) return <p>Cargando clientes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!clients.length) return <p>No hay clientes.</p>;

  return (
    <div>
      <h2>Clientes</h2>
      <ul>
        {clients.map((c) => (
          <li key={c.id}>
            {c.id} – {c.name} {c.surname} – {c.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Hola;
