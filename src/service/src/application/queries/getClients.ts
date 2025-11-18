import { http } from '@/service/src/httpClient';
import type { Client } from '@/domain/client';

export async function getClients(): Promise<Client[]> {
  const jwt = process.env.NEXT_PUBLIC_JWT;

  return http<Client[]>(
    'http://localhost:8081/api/client/findAll',
    {
      method: 'GET', 
    },
    jwt
  );
}

export async function getClientsByName(name: string): Promise<Client[]> {
  const jwt = process.env.NEXT_PUBLIC_JWT;

  const query = new URLSearchParams({ name }).toString();

  return http<Client[]>(
    `http://localhost:8081/api/client/findByName?${query}`,
    {
      method: 'GET',
    },
    jwt
  );
}

export async function getClientsByEmail(email: string): Promise<Client[]> {
  const jwt = process.env.NEXT_PUBLIC_JWT;

  const query = new URLSearchParams({ email }).toString();

  return http<Client[]>(
    `http://localhost:8081/api/client/search/by-email?${email}`,
    {
      method: 'GET',
    },
    jwt
  );
}