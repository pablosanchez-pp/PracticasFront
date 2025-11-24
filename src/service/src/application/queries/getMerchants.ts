import { http } from '@/service/src/httpClient';
import type { Merchant } from '@/domain/merchant';

const BASE_URL = 'http://localhost:8082/api/merchant';

export async function getMerchants(): Promise<Merchant[]> {
  const jwt = process.env.NEXT_PUBLIC_JWT;

  return http<Merchant[]>(
    `${BASE_URL}/findAll`,
    {
      method: 'GET',
    },
    jwt,
  );
}

export async function getMerchantsByName(nombre: string): Promise<Merchant[]> {
  const jwt = process.env.NEXT_PUBLIC_JWT;

  return http<Merchant[]>(
    `${BASE_URL}/nombre/${encodeURIComponent(nombre)}`,
    {
      method: 'GET',
    },
    jwt,
  );
}

export type NewMerchant = Pick<Merchant, 'name' | 'address' | 'merchantType'>;

export async function createMerchant(data: NewMerchant): Promise<Merchant> {
  const jwt = process.env.NEXT_PUBLIC_JWT;

  return http<Merchant>(
    BASE_URL,
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


export type UpdateMerchantData = Pick<
  Merchant,
  'name' | 'address' | 'merchantType'
>;

export async function updateMerchant(
  id: Merchant['id'],
  data: UpdateMerchantData,
): Promise<Merchant> {
  const jwt = process.env.NEXT_PUBLIC_JWT;

  return http<Merchant>(
    `${BASE_URL}/${id}`,
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

export async function deleteMerchant(id: Merchant['id']): Promise<void> {
  const jwt = process.env.NEXT_PUBLIC_JWT;

  return http<void>(
    `${BASE_URL}/${id}`,
    {
      method: 'DELETE',
    },
    jwt,
  );
}

export async function getClientOfMerchant(
  merchantId: Merchant['id'],
): Promise<string> {
  const jwt = process.env.NEXT_PUBLIC_JWT;

  return http<string>(
    `${BASE_URL}/${merchantId}/client`,
    {
      method: 'GET',
    },
    jwt,
  );
}