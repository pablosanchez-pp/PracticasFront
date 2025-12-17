import Service from '@/service/src';
import type { Merchant } from '@/domain/merchant';

export async function listClientMerchants(clientId: string): Promise<string[]> {
  const controller = new AbortController();
  const signal = controller.signal;

  const res = await Service.getCases('listMerchant', {
    signal,
    endPointData: { clientId },
    token: undefined,
  });

  return Array.isArray(res) ? (res as string[]) : [];
}

export async function listAllMerchants(): Promise<Merchant[]> {
  const controller = new AbortController();
  const signal = controller.signal;

  const res = await Service.getCases('getMerchant', {
    signal,
    endPointData: {},
    token: undefined,
  });

  return Array.isArray(res) ? (res as Merchant[]) : [];
}

export async function linkClientToMerchant(clientId: string, merchantId: string): Promise<void> {
  const controller = new AbortController();
  const signal = controller.signal;

  await Service.getCases('link', {
    signal,
    endPointData: { clientId, merchantId },
    token: undefined,
  });
}

export default {
  listClientMerchants,
  listAllMerchants,
  linkClientToMerchant,
};
