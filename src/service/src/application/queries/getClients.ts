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


export type NewClient = Pick<Client, 'name' | 'surname' | 'email' | 'phone' | 'cifNifNie'>;

export async function createClient(data: NewClient): Promise<Client> {
  const jwt = process.env.NEXT_PUBLIC_JWT;

  return http<Client>(
    'http://localhost:8081/api/client',     
    {
      method: 'POST',
      body: JSON.stringify(data),          
      headers: {
        'Content-Type': 'application/json',
      },
    },
    jwt,
  );
}


export async function deleteClient(id: Client['id']): Promise<void> {
  const jwt = process.env.NEXT_PUBLIC_JWT;

  return http<void>(
    `http://localhost:8081/api/client/${id}`,
    {
      method: 'DELETE',
    },
    jwt,
  );

}
export type UpdateClient = Pick<Client,'id' | 'name' | 'surname' | 'email' | 'phone' | 'cifNifNie'>;


export async function updateClient(data: UpdateClient): Promise<Client> {
  const jwt = process.env.NEXT_PUBLIC_JWT;

  return http<Client>(
    `http://localhost:8081/api/client/${data.id}`, // PUT /api/client/{id}
    {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    },
    jwt,
  );
}