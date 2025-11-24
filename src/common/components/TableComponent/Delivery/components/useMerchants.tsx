'use client';

import { useEffect, useState } from 'react';
import type { Merchant } from '@/domain/merchant';
import {
  getMerchants,
  getMerchantsByName,
  createMerchant,
  updateMerchant,
  deleteMerchant,         
  type NewMerchant,
  type UpdateMerchantData,
  getClientOfMerchant
} from '@/service/src/application/queries/getMerchants';

export function useMerchants() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAll = async () => {
    try {
      setLoading(true);
      const data = await getMerchants();
      setMerchants(data);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? 'Error loading merchants');
    } finally {
      setLoading(false);
    }
  };

  const searchByName = async (name: string) => {
    try {
      setLoading(true);
      if (!name.trim()) {
        await loadAll();
        return;
      }
      const data = await getMerchantsByName(name);
      setMerchants(data);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? 'Error searching merchants');
    } finally {
      setLoading(false);
    }
  };

  const addMerchant = async (data: NewMerchant) => {
    const created = await createMerchant(data);
    setMerchants((prev) => [...prev, created]);
  };

  const editMerchant = async (id: Merchant['id'], data: UpdateMerchantData) => {
    const updated = await updateMerchant(id, data);
    setMerchants((prev) => prev.map((m) => (m.id === id ? updated : m)));
  };

  
  const removeMerchant = async (id: Merchant['id']) => {
    try {
      await deleteMerchant(id);                    
      setMerchants((prev) => prev.filter((m) => m.id !== id));
      setError(null);
    } catch (e: any) {
      console.error('Error deleting merchant', e);
      setError(e?.message ?? 'Error deleting merchant');
    }
  };

  const getClientForMerchant = async (id: Merchant['id']) => {
    try {
      const clientId = await getClientOfMerchant(id);
      setError(null);
      return clientId; // string con el ID del cliente
    } catch (e: any) {
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
    getClientForMerchant
  };
}
