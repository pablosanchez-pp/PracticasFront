import ClientsPage from './ClientsPage';
import type { Client } from '@/domain/client';
import { listClients, getClientById, getClientsByName, getClientsByEmail } from '@/common/server/clientsActions';

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

    return <ClientsPage initialClients={clients} />;
  } catch (err) {
    console.error('ClientsPageServer error:', err);
    return <ClientsPage />;
  }
}