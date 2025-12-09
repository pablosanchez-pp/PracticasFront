import MerchantsPage from './MerchantsPage';
import type { Merchant } from '@/domain/merchant';
import { listMerchants, getMerchantById, getMerchantsByName } from '@/common/server/merchantActions';

type Props = { searchParams?: { id?: string; name?: string; query?: string } };

export default async function MerchantsPageServer({ searchParams }: Props) {
  try {
    let merchants: Merchant[] = [];

    if (searchParams?.id) {
      const single = await getMerchantById(searchParams.id);
      merchants = single ? [single] : [];
    } else if (searchParams?.name) {
      merchants = await getMerchantsByName(String(searchParams.name));
    } else if (searchParams?.query) {
      merchants = await getMerchantsByName(String(searchParams.query));
    } else {
      merchants = await listMerchants();
    }

    return <MerchantsPage initialMerchants={merchants} />;
  } catch (err) {
    console.error('MerchantsPageServer error:', err);
    return <MerchantsPage />;
  }
}