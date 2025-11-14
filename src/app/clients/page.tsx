'use client';

import { useEffect, useState } from 'react';
import { getClients } from '@/service/src/application/queries/getClients';
import type { Client } from '@/domain/client';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getClients()
      .then((data) => setClients(data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Error desconocido'),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando clientes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!clients.length) return <p>No hay clientes.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Clientes</h1>
      <table border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.surname}</td>
              <td>{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
