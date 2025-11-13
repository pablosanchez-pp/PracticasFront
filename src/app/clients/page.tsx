'use client';
import { useEffect, useState } from 'react';
import { http } from '@/service/src/httpClient';

interface Client {
  id: string;
  name: string;
  surname: string;
  email: string;
}

const API = process.env.NEXT_PUBLIC_API_CLIENT!;

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    http<Client[]>(API)
      .then(setClients)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Clientes</h1>
      <table border={1}>
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Apellido</th><th>Email</th></tr>
        </thead>
        <tbody>
          {clients.map(c => (
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
