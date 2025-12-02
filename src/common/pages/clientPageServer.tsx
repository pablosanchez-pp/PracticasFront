import ClientsPage from './ClientsPage';
import type { Client } from '@/domain/client';
import {listClients,getClientById,getClientsByName,getClientsByEmail,revalidateClients,} from '@/common/server/clientsActions';

type Props = { searchParams?: { id?: string; name?: string; email?: string } };

export default async function ClientsPageServer({ searchParams }: Props) {
  try {
    let clients: Client[] = [];

    if (searchParams?.id) {
      const single = await getClientById(searchParams.id);
      clients = single ? [single] : [];
    } else if (searchParams?.name) {
      clients = await getClientsByName(String(searchParams.name));
    } else if (searchParams?.email) {
      clients = await getClientsByEmail(String(searchParams.email));
    } else {
      clients = await listClients();
    }

    const actions = {
      list: listClients,
      getById: getClientById,
      getByName: getClientsByName,
      getByEmail: getClientsByEmail,
      revalidate: revalidateClients,
    };

    return <ClientsPage initialClients={clients} actions={actions} />;
  } catch (err) {
    console.error('ClientsPageServer error:', err);
    return <ClientsPage />;
  }
}