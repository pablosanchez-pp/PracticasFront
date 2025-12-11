import Service from '@/service/src';
import { getErrorMessage } from '@/common/utils/errorHelpers';
import type { MerchantFormValues } from '../Delivery/interface';

export async function createMerchant(data: MerchantFormValues, signal?: AbortSignal) {
  const jwt = process.env.NEXT_PUBLIC_JWT;
  try {
    const res = await Service.getCases('createMerchant', {
      signal,
      endPointData: data,
      token: jwt,
    });
    return res;
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err, 'Error creando merchant'));
  }
}

export async function updateMerchant(id: string, data: MerchantFormValues, signal?: AbortSignal) {
  const jwt = process.env.NEXT_PUBLIC_JWT;
  try {
    const res = await Service.getCases('updateMerchant', {
      signal,
      endPointData: { id, ...data },
      token: jwt,
    });
    return res;
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err, 'Error actualizando merchant'));
  }
}