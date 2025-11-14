'use client';

import { useEffect, useState } from 'react';
import type { Client } from '@/domain/client';
import { onClick as fetchClients } from '../../Infrastructure/exampleFunctions';

export default function Hola() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchClients()
      .then((response) => {
        setClients(response as Client[]);
      })
      .catch((err) => {
        console.error('ERROR EN getClients:', err);
        setError(String(err?.message ?? err));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando clientes...</p>;
  if (error) return <p>{error}</p>;
  if (!clients.length) return <p>No hay clientes.</p>;

  return (
    <div>
      <h1>Clientes</h1>
      <ul>
        {clients.map((c) => (
          <li key={c.id}>
            {c.name} {c.surname} – {c.email}
          </li>
        ))}
      </ul>
    </div>
  );
}