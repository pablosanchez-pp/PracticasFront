'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Service from '@/service/src';
import type { Client } from '@/domain/client';

import { Spin, Alert, Typography, Input, Button, Tooltip, Modal } from 'antd';

import ClientsTable from '../components/ClientTable/Delivery';
import { getErrorMessage, isAbortError } from '@/common/utils/errorHelpers';

import ClientForm, { ClientFormValues } from '../components/ClientForm/Delivery';
import ClientMerchantsModal from '../components/ClientMerchantModal/Delivery';

import { revalidatePage } from '@/common/utils/revalidatePath';

const { Title } = Typography;

type ClientsPageActions = {
  list?: () => Promise<Client[]>;
  getById?: (id: string) => Promise<Client | null>;
  getByName?: (query: string) => Promise<Client[]>;
  getByEmail?: (email: string) => Promise<Client[]>;
};

const Hola: React.FC<{ initialClients?: Client[]; actions?: ClientsPageActions }> = ({ initialClients, actions }) => {
  
  const loading = false;
  const [error, setError] = useState<string | null>(
    initialClients && Array.isArray(initialClients) ? null : 'No hay acción del servidor para obtener clientes'
  );

  const [search, setSearch] = useState({ name: '', email: '' });
  const [modal, setModal] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    editingClient: Client | null;
  }>({ open: false, mode: 'create', editingClient: null });
  
  const [submitting, setSubmitting] = useState(false);

  
  const router = useRouter();

  const [merchantsModalOpen, setMerchantsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const handleSearchByName = (term?: string) => {
    setSearch((s) => ({ ...s, email: '' }));
    const name = (term ?? search.name).trim();
    const base = '/clients';
    if (!name) {
      router.replace(base);
      return;
    }
    router.replace(`${base}?name=${encodeURIComponent(name)}`);
  };

  const handleSearchByEmail = (term?: string) => {
    setSearch((s) => ({ ...s, name: '' }));
    const email = (term ?? search.email).trim();
    const base = '/clients';
    if (!email) {
      router.replace(base);
      return;
    }
    router.replace(`${base}?email=${encodeURIComponent(email)}`);
  };

  const handleCreateClient = async (values: ClientFormValues) => {
    setError(null);
    setSubmitting(true);

    const jwt = process.env.NEXT_PUBLIC_JWT;
    const controller = new AbortController();
    const signal = controller.signal;

      try {
      await Service.getCases('createClient', {
        signal,
        endPointData: values,
        token: jwt,
      });

  revalidatePage('/clients');

  setModal((m) => ({ ...m, open: false, editingClient: null }));
    } catch (err: unknown) {
      if (isAbortError(err)) return;
      console.error('ERROR EN createClient:', err);
      setError(getErrorMessage(err, 'Ha ocurrido un error al crear el cliente'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClient = async (id: Client['id']) => {

    const jwt = process.env.NEXT_PUBLIC_JWT;
    const controller = new AbortController();
    const signal = controller.signal;

    setError(null);

    try {
      await Service.getCases('deleteClient', {
        signal,
        endPointData: { id },
        token: jwt,
      });

  
      revalidatePage('/clients');
      
    } catch (err: unknown) {
      console.error('ERROR EN deleteClient:', err);
      setError(getErrorMessage(err, 'Ha ocurrido un error al eliminar el cliente'));
    }
  };

  const handleEditClient = (client: Client) => {
    setModal((m) => ({ ...m, open: true, mode: 'edit', editingClient: client }));
  };

  const handleUpdateClient = async (values: ClientFormValues) => {
    if (!modal.editingClient) return;

    const jwt = process.env.NEXT_PUBLIC_JWT;
    const controller = new AbortController();
    const signal = controller.signal;

  setError(null);
  setSubmitting(true);
 
    try {
      const updated = await Service.getCases('updateClient', {
        signal,
        endPointData: {
          id: modal.editingClient.id,
          name: values.name,
          surname: values.surname,
          email: values.email,
          phone: values.phone,
          cifNifNie: values.cifNifNie,
        },
        token: jwt,
      });

  
  revalidatePage('/clients');

  setModal((m) => ({ ...m, open: false, editingClient: null }));
    } catch (err: unknown) {
      console.error('ERROR EN updateClient:', err);
      setError(getErrorMessage(err, 'Ha ocurrido un error al actualizar el cliente'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (values: ClientFormValues) => {
    if (modal.mode === 'create') {
      handleCreateClient(values);
    } else {
      handleUpdateClient(values);
    }
  };

  // fill-example behaviour moved inside ClientForm

  const openMerchantsModal = (client: Client) => {
    setSelectedClient(client);
    setMerchantsModalOpen(true);
  };

  const handleNameInputChange = (value: string) => {
    setSearch({ name: value, email: '' });
  };

  return (
    <section className="min-h-screen bg-slate-800 py-8 px-4">
      {/* Contenedor centrado para que todo tenga el mismo ancho */}
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Cabecera + búsqueda + botón crear */}
        <div className="space-y-3">
          <div>
            <Title level={2} style={{ marginBottom: 4, color: '#ffffff' }}>
              Clientes
            </Title>
          </div>

          <div className="flex w-full items-center justify-between gap-4">
            {/* Buscador a la izquierda */}
            <Input
              placeholder="Buscar por nombre..."
              value={search.name}
              onChange={(e) => handleNameInputChange(e.target.value)}
              onPressEnter={() => handleSearchByName()}
              allowClear
              onClear={() => {
                setSearch({ name: '', email: '' });
                handleSearchByName('');
              }}
              className="w-full max-w-xs"
            />

            {/* Botón pequeño pegado a la derecha */}
            <Button
              type="primary"
              onClick={() => {
                setModal((m) => ({ ...m, open: true, mode: 'create', editingClient: null }));
              }}
              className="shrink-0"
            >
              Nuevo cliente
            </Button>
          </div>
        </div>
        {/* Error */}
        {error && (
          <Alert
            type="error"
            message="Error al cargar clientes"
            description={error}
            showIcon
          />
        )}

        {/* Tabla dentro de una tarjeta blanca (mismo ancho que el buscador) */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex justify-center py-10">
              <Spin tip="Cargando clientes...">
                <div style={{ minHeight: 40 }} />
              </Spin>
            </div>
          ) : (
            <ClientsTable
              clients={initialClients ?? []}
              onEdit={handleEditClient}
              onDelete={handleDeleteClient}
              onOpenMerchants={openMerchantsModal}
              searchEmail={search.email}
              onEmailChange={(val) => setSearch({ name: '', email: val })}
              onEmailPressEnter={() => handleSearchByEmail()}
              onEmailClear={() => {
                setSearch({ name: '', email: '' });
                handleSearchByEmail('');
              }}
            />
          )}
        </div>

        {/* Modal único crear/editar cliente */}
        <Modal
          open={modal.open}
          title={modal.mode === 'create' ? 'Crear cliente' : 'Editar cliente'}
          onCancel={() => {
          setModal((m) => ({ ...m, open: false, editingClient: null }));
          }}
          footer={null}
        >
          <ClientForm
            initialValues={modal.editingClient ? {
              name: modal.editingClient.name,
              surname: modal.editingClient.surname,
              email: modal.editingClient.email,
              phone: modal.editingClient.phone,
              cifNifNie: modal.editingClient.cifNifNie,
            } : undefined}
            mode={modal.mode}
            loading={submitting}
            onSubmit={handleSubmit}
          />
        </Modal>

        {/* Modal para ver/asociar merchants */}
        <ClientMerchantsModal
          open={merchantsModalOpen}
          client={selectedClient}
          onClose={() => {
            setMerchantsModalOpen(false);
            setSelectedClient(null);
          }}
        />
      </div>
    </section>
  );
};

export default Hola;
