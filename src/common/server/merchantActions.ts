import Service from '@/service/src';
import type { Merchant } from '@/domain/merchant';
import type { Client } from '@/domain/client';
import { revalidatePage } from '@/common/utils/revalidatePath';

const SERVER_JWT = process.env.BACKEND_JWT ?? process.env.NEXT_PUBLIC_JWT;

type ListParams = Record<string, unknown> | undefined;

export async function listMerchants(params?: ListParams): Promise<Merchant[]> {
  'use server';
  try {
    const res = await Service.getCases('getMerchant', {
      signal: undefined,
      endPointData: params ?? {},
      token: SERVER_JWT,
    });

    return Array.isArray(res) ? (res as Merchant[]) : [];
  } catch (err) {
    console.error('listMerchants error', err);
    throw err;
  }
}

export async function getMerchantById(id: string): Promise<Merchant | null> {
  'use server';
  try {
    const res = await Service.getCases('getMerchantById', {
      signal: undefined,
      endPointData: { id },
      token: SERVER_JWT,
    });

    return (res as Merchant) ?? null;
  } catch (err) {
    console.error('getMerchantById error', err);
    throw err;
  }
}

export async function getMerchantsByName(query: string): Promise<Merchant[]> {
  'use server';
  try {
    // keep the param name consistent with client hook (nombre)
    const res = await Service.getCases('getMerchantByName', {
      signal: undefined,
      endPointData: { nombre: query },
      token: SERVER_JWT,
    });

    return Array.isArray(res) ? (res as Merchant[]) : [];
  } catch (err) {
    console.error('getMerchantsByName error', err);
    throw err;
  }
}

export async function revalidateMerchants(): Promise<void> {
  'use server';
  try {
    revalidatePage('/merchants');
  } catch (err) {
    console.error('revalidateMerchants error', err);
    throw err;
  }
}

export async function getClientsOfMerchant(merchantId: string): Promise<string[] | string | null> {
  'use server';
  try {
    const res = await Service.getCases('getClientOfMerchant', {
      signal: undefined,
      endPointData: { merchantId },
      token: SERVER_JWT,
    });

    // Service may return a string or an array of strings; normalize to that shape or null
    if (res == null) return null;
    if (typeof res === 'string') return res as string;
    if (Array.isArray(res)) return res as string[];
    // otherwise try to coerce where possible
    return null;
  } catch (err) {
    console.error('getClientsOfMerchant error', err);
    throw err;
  }
}

export default {
  listMerchants,
  getMerchantById,
  getMerchantsByName,
  revalidateMerchants,
  getClientsOfMerchant,
};
