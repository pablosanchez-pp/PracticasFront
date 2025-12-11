import Service from '@/service/src';
import { getErrorMessage } from '@/common/utils/errorHelpers';

import type { ClientFormValues } from '../Delivery/interface';

export async function createClient(data: ClientFormValues, signal?: AbortSignal) {
  const jwt = process.env.NEXT_PUBLIC_JWT;
  try {
    const res = await Service.getCases('createClient', {
      signal,
      endPointData: data,
      token: jwt,
    });
    return res;
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err, 'Error creando cliente'));
  }
}

export async function updateClient(id: string, data: ClientFormValues, signal?: AbortSignal) {
  const jwt = process.env.NEXT_PUBLIC_JWT;
  try {
    const res = await Service.getCases('updateClient', {
      signal,
      endPointData: { id, ...data },
      token: jwt,
    });
    return res;
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err, 'Error actualizando cliente'));
  }
}