'use server';

import Service from '@/service/src';
import type { Merchant } from '@/domain/merchant';

const SERVER_JWT = process.env.BACKEND_JWT ?? process.env.NEXT_PUBLIC_JWT;

type ListParams = Record<string, unknown> | undefined;

export async function listMerchants(params?: ListParams, token?: string): Promise<Merchant[]> {
  try {
    const res = await Service.getCases('getMerchant', {
      signal: undefined,
      endPointData: params ?? {},
      token: token ?? SERVER_JWT,
    });

    return Array.isArray(res) ? (res as Merchant[]) : [];
  } catch (err) {
    console.error('listMerchants error', err);
    throw err;
  }
}

export async function getMerchantById(id: string, token?: string): Promise<Merchant | null> {
  try {
    const res = await Service.getCases('getMerchantById', {
      signal: undefined,
      endPointData: { id },
      token: token ?? SERVER_JWT,
    });

    return (res as Merchant) ?? null;
  } catch (err) {
    console.error('getMerchantById error', err);
    throw err;
  }
}

export async function getMerchantsByName(query: string, token?: string): Promise<Merchant[]> {
  try {
    const res = await Service.getCases('getMerchantByName', {
      signal: undefined,
      endPointData: { nombre: query },
      token: token ?? SERVER_JWT,
    });

    return Array.isArray(res) ? (res as Merchant[]) : [];
  } catch (err) {
    console.error('getMerchantsByName error', err);
    throw err;
  }
}

export async function getClientsOfMerchant(merchantId: string, token?: string): Promise<string[] | string | null> {
  try {
    const res = await Service.getCases('getClientOfMerchant', {
      signal: undefined,
      endPointData: { merchantId },
      token: token ?? SERVER_JWT,
    });

    if (res == null) 
      return null;
    if (typeof res === 'string') 
      return res as string;
    if (Array.isArray(res)) 
      return res as string[];
    return null;
    
  } catch (err) {
    console.error('getClientsOfMerchant error', err);
    throw err;
  }
}