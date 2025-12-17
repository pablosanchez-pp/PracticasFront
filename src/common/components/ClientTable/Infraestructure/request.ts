import Service from '@/service/src';
import { getErrorMessage } from '@/common/utils/errorHelpers';

export async function deleteClient(id: string, signal?: AbortSignal) {
  try {
    const res = await Service.getCases('deleteClient', {
      signal,
      endPointData: { id },
      token: undefined,
    });
    return res;
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err, 'Error eliminando cliente'));
  }
}
