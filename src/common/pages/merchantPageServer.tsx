import MerchantsPage from './MerchantsPage';
import type { Merchant } from '@/domain/merchant';
import { listMerchants, getMerchantById, getMerchantsByName, revalidateMerchants, getClientsOfMerchant } from '@/common/server/merchantActions';
import {getClientById } from '@/common/server/clientsActions';

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

    const actions = {
      list: listMerchants,
      getById: getMerchantById,
      getByName: getMerchantsByName,
      revalidate: revalidateMerchants,
      getClientsOfMerchant: getClientsOfMerchant,
      getClientById: getClientById,
    };

    return <MerchantsPage initialMerchants={merchants} actions={actions} />;
  } catch (err) {
    console.error('MerchantsPageServer error:', err);
    return <MerchantsPage />;
  }
}