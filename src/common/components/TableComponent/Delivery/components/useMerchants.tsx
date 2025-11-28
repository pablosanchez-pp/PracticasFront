'use client';

import { useEffect, useState } from 'react';
import Service from '@/service/src';
import type { Merchant } from '@/domain/merchant';

// Datos que se envían al crear/editar (los del formulario)
type MerchantPayload = {
  name: string;
  address: string;
  merchantType: string;
};

export function useMerchants() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAll = async () => {
    const jwt = process.env.NEXT_PUBLIC_JWT;
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLoading(true);

      const data = await Service.getCases('getMerchant', {
        signal,
        endPointData: {},
        token: jwt,
      });

      const lista = Array.isArray(data) ? (data as Merchant[]) : [];
      setMerchants(lista);
      setError(null);
    } catch (e: any) {
      console.error('ERROR EN getMerchants:', e);
      setError(e?.message ?? 'Error loading merchants');
    } finally {
      setLoading(false);
    }
  };

  const searchByName = async (name: string) => {
    const jwt = process.env.NEXT_PUBLIC_JWT;
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLoading(true);

      if (!name.trim()) {
        await loadAll();
        return;
      }

      // nuestro endpoint es /nombre/{nombre}, así que mandamos { nombre }
      const data = await Service.getCases('getMerchantByName', {
        signal,
        endPointData: { nombre: name },
        token: jwt,
      });

      const lista = Array.isArray(data) ? (data as Merchant[]) : [];
      setMerchants(lista);
      setError(null);
    } catch (e: any) {
      console.error('ERROR EN getMerchantsByName:', e);
      setError(e?.message ?? 'Error searching merchants');
    } finally {
      setLoading(false);
    }
  };

  const addMerchant = async (data: MerchantPayload) => {
    const jwt = process.env.NEXT_PUBLIC_JWT;
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const created = await Service.getCases('createMerchant', {
        signal,
        endPointData: data,
        token: jwt,
      });

      setMerchants((prev) => [...prev, created as Merchant]);
      setError(null);
    } catch (e: any) {
      console.error('ERROR EN createMerchant:', e);
      setError(e?.message ?? 'Error creating merchant');
      throw e;
    }
  };

  const editMerchant = async (id: Merchant['id'], data: MerchantPayload) => {
    const jwt = process.env.NEXT_PUBLIC_JWT;
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const updated = await Service.getCases('updateMerchant', {
        signal,
        // aquí NO hay conflicto, porque MerchantPayload no tiene `id`
        endPointData: { id, ...data },
        token: jwt,
      });

      const updatedMerchant = updated as Merchant;

      setMerchants((prev) =>
        prev.map((m) => (m.id === id ? updatedMerchant : m)),
      );
      setError(null);
    } catch (e: any) {
      console.error('ERROR EN updateMerchant:', e);
      setError(e?.message ?? 'Error updating merchant');
      throw e;
    }
  };

  const removeMerchant = async (id: Merchant['id']) => {
    const jwt = process.env.NEXT_PUBLIC_JWT;
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      await Service.getCases('deleteMerchant', {
        signal,
        endPointData: { id },
        token: jwt,
      });

      setMerchants((prev) => prev.filter((m) => m.id !== id));
      setError(null);
    } catch (e: any) {
      console.error('ERROR EN deleteMerchant:', e);
      setError(e?.message ?? 'Error deleting merchant');
    }
  };

  const getClientForMerchant = async (id: Merchant['id']) => {
    const jwt = process.env.NEXT_PUBLIC_JWT;
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const clientIdOrIds = await Service.getCases('getClientOfMerchant', {
        signal,
        endPointData: { merchantId: id },
        token: jwt,
      });

      setError(null);
      return clientIdOrIds; // puede ser string o string[]
    } catch (e: any) {
      console.error('ERROR EN getClientOfMerchant:', e);
      setError(e?.message ?? 'Error getting client of merchant');
      throw e;
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  return {
    merchants,
    loading,
    error,
    loadAll,
    searchByName,
    addMerchant,
    editMerchant,
    removeMerchant,
    setError,
    getClientForMerchant,
  };
}
