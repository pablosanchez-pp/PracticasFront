import MerchantsPage from './MerchantsPage';
import type { Merchant } from '@/domain/merchant';
import { listMerchants, getMerchantById, getMerchantsByName } from '@/common/server/merchantActions';
import { cookies } from 'next/headers';

type Props = { searchParams?: { id?: string; name?: string; query?: string } };

export default async function MerchantsPageServer({ searchParams }: Props) {
  try {
    let merchants: Merchant[] = [];
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (searchParams?.id) {
      const single = await getMerchantById(searchParams.id, token ?? undefined);
      merchants = single ? [single] : [];
    } else if (searchParams?.name) {
      merchants = await getMerchantsByName(String(searchParams.name), token ?? undefined);
    } else if (searchParams?.query) {
      merchants = await getMerchantsByName(String(searchParams.query), token ?? undefined);
    } else {
      merchants = await listMerchants(undefined, token ?? undefined);
    }

    return <MerchantsPage initialMerchants={merchants} />;
  } catch (err) {
    console.error('MerchantsPageServer error:', err);
    return <MerchantsPage />;
  }
}