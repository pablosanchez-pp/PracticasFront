import Service from '@/service/src';
import { getErrorMessage } from '@/common/utils/errorHelpers';

export async function deleteClient(id: string, signal?: AbortSignal) {
  const jwt = process.env.NEXT_PUBLIC_JWT;
  try {
    const res = await Service.getCases('deleteClient', {
      signal,
      endPointData: { id },
      token: jwt,
    });
    return res;
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err, 'Error eliminando cliente'));
  }
}
