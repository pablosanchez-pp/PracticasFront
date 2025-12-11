'use server'

import Service from '@/service/src';
import type { Client } from '@/domain/client';

const SERVER_JWT = process.env.BACKEND_JWT ?? process.env.NEXT_PUBLIC_JWT;

type ListParams = Record<string, unknown> | undefined;

export async function listClients(params?: ListParams): Promise<Client[]> {
  try {
    const res = await Service.getCases('getClient', {
      signal: undefined,
      endPointData: params ?? {},
      token: SERVER_JWT,
    });

    return Array.isArray(res) ? (res as Client[]) : [];
  } catch (err) {
    console.error('listClients error', err);
    throw err;
  }
}

export async function getClientById(id: string): Promise<Client | null> {
  try {
    const res = await Service.getCases('getClientById', {
      signal: undefined,
      endPointData: { id },
      token: SERVER_JWT,
    });

    return (res as Client) ?? null;
  } catch (err) {
    console.error('getClientById error', err);
    throw err;
  }
}


export async function getClientsByName(query: string): Promise<Client[]> {
  try {
    const res = await Service.getCases('getClientByName', {
      signal: undefined,
      endPointData: { query },
      token: SERVER_JWT,
    });

    return Array.isArray(res) ? (res as Client[]) : [];
  } catch (err) {
    console.error('getClientsByName error', err);
    throw err;
  }
}

export async function getClientsByEmail(email: string): Promise<Client[]> {
  try {
    const res = await Service.getCases('getClientByEmail', {
      signal: undefined,
      endPointData: { email },
      token: SERVER_JWT,
    });

    return Array.isArray(res) ? (res as Client[]) : [];
  } catch (err) {
    console.error('getClientsByEmail error', err);
    throw err;
  }
}

