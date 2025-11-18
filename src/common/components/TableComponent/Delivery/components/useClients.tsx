'use client';

import { useEffect, useState } from 'react';
import Service from '@/service/src';
import type { Client } from '@/domain/client';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    setError(null);

    Service.getCases('getClients', {
      signal,
      endPointData: {},
      token: process.env.NEXT_PUBLIC_JWT,
    })
      .then((res) => {
        const lista = Array.isArray(res) ? (res as Client[]) : [];
        setClients(lista);
      })
      .catch((err: any) => {
        if (err?.name === 'AbortError') return;
        console.error('ERROR EN getClients:', err);

        const errorMessage =
          err?.body?.message ||
          err?.body?.error ||
          err?.statusText ||
          'Ha ocurrido un error al cargar los clientes';

        setError(errorMessage);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return {
    clients,
    setClients,
    loading,
    setLoading,
    error,
    setError,
  };
}
