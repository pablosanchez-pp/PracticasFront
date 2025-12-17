import Service from '@/service/src';
import { getErrorMessage } from '@/common/utils/errorHelpers';

export async function deleteMerchant(id: string, signal?: AbortSignal) {
  try {
    const res = await Service.getCases('deleteMerchant', {
      signal,
      endPointData: { id },
      token: undefined,
    });
    return res;
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err, 'Error eliminando merchant'));
  }
}
