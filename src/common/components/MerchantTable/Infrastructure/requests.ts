import Service from '@/service/src';
import { getErrorMessage } from '@/common/utils/errorHelpers';

export async function deleteMerchant(id: string, signal?: AbortSignal) {
  const jwt = process.env.NEXT_PUBLIC_JWT;
  try {
    const res = await Service.getCases('deleteMerchant', {
      signal,
      endPointData: { id },
      token: jwt,
    });
    return res;
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err, 'Error eliminando merchant'));
  }
}
