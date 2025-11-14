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