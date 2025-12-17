import ClientsPage from './ClientsPage';
import type { Client } from '@/domain/client';
import { listClients, getClientById, getClientsByName, getClientsByEmail } from '@/common/server/clientsActions';
import { cookies } from 'next/headers';

type Props = { searchParams?: { id?: string; name?: string; email?: string } };

export default async function ClientsPageServer({ searchParams }: Props) {
  try {
    let clients: Client[] = [];
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (searchParams?.id) {
      const single = await getClientById(searchParams.id, token ?? undefined);
      clients = single ? [single] : [];
    } else if (searchParams?.name) {
      clients = await getClientsByName(String(searchParams.name), token ?? undefined);
    } else if (searchParams?.email) {
      clients = await getClientsByEmail(String(searchParams.email), token ?? undefined);
    } else {
      clients = await listClients(undefined, token ?? undefined);
    }

    return <ClientsPage initialClients={clients} />;
  } catch (err) {
    console.error('ClientsPageServer error:', err);
    return <ClientsPage />;
  }
}