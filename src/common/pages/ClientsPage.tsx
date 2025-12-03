'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Service from '@/service/src';
import type { Client } from '@/domain/client';
import type { Merchant } from '@/domain/merchant';

import { Spin, Alert, Typography, Input, Button, Form, Tooltip, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import ClientsTable from '../components/TableComponent/Delivery/components/ClientsTable';

import { DeleteOutlined, EditOutlined, ApartmentOutlined } from '@ant-design/icons';

import ClientForm, { ClientFormValues } from '../components/TableComponent/Delivery/components/ClientForm';
import ClientMerchantsModal from '../components/TableComponent/Delivery/components/ClientMerchantsModals';

const { Title } = Typography;

type ClientsPageActions = {
  // Only read actions are allowed from the server wrapper. Mutations run client-side.
  list?: () => Promise<any>;
  getById?: (id: string) => Promise<any>;
  getByName?: (query: string) => Promise<any>;
  getByEmail?: (email: string) => Promise<any>;
  // Merchant-related server reads
  listMerchants?: () => Promise<any>;
  listMerchant?: (clientId: string) => Promise<any>;
  revalidate?: () => Promise<void>;
};

const Hola: React.FC<{ initialClients?: Client[]; actions?: ClientsPageActions }> = ({ initialClients, actions }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (initialClients && Array.isArray(initialClients)) {
      setClients(initialClients);
      setLoading(false);
      setError(null);
      return;
    }

    setClients([]);
    setLoading(false);
    setError('No hay acción del servidor para obtener clientes');
  }, [initialClients]);

  const [search, setSearch] = useState({ name: '', email: '' });
  const [form] = Form.useForm<ClientFormValues>();
  const [modal, setModal] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    editingClient: Client | null;
    formMounted: boolean;
  }>({ open: false, mode: 'create', editingClient: null, formMounted: false });
  
  const [submitting, setSubmitting] = useState(false);

  const [exampleIndex, setExampleIndex] = useState(1);

  const [merchantsModalOpen, setMerchantsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [clientMerchants, setClientMerchants] = useState<string[]>([]);

  const [allMerchants, setAllMerchants] = useState<Merchant[]>([]);
  const [merchantsLoading, setMerchantsLoading] = useState({ client: false, all: false });

  const [selectedMerchantId, setSelectedMerchantId] = useState<string | undefined>(undefined);
  const [linkingMerchant, setLinkingMerchant] = useState(false);

  const handleSearchByName = async (term?: string) => {
    setSearch((s) => ({ ...s, email: '' }));
    const name = (term ?? search.name).trim();
    setLoading(true);
    setError(null);
    try {
      if (!name) {
        if (!actions?.list) {
          setError('Acción del servidor list no disponible');
          setClients([]);
          return;
        }
        const res = await actions.list();
        const lista = Array.isArray(res) ? (res as Client[]) : [];
        setClients(lista);
        return;
      }

      if (!actions?.getByName) {
        setError('Acción del servidor getByName no disponible');
        setClients([]);
        return;
      }

      const res = await actions.getByName(name);
      const lista = Array.isArray(res) ? (res as Client[]) : [];
      setClients(lista);
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.error('ERROR EN getClientsByName:', err);
      
      const status = err?.status || err?.body?.status;
      if (status === 404 || status === 500) {
        setClients([]);
        setError(null);
        return;
      }
      const errorMessage =
        err?.body?.message || err?.body?.error || err?.statusText || 'Ha ocurrido un error al cargar los clientes';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByEmail = async (term?: string) => {
    setSearch((s) => ({ ...s, name: '' }));
    const email = (term ?? search.email).trim();
    setLoading(true);
    setError(null);
    try {
      if (!email) {
        if (!actions?.list) {
          setError('Acción del servidor list no disponible');
          setClients([]);
          return;
        }
        const res = await actions.list();
        const lista = Array.isArray(res) ? (res as Client[]) : [];
        setClients(lista);
        return;
      }

      if (!actions?.getByEmail) {
        setError('Acción del servidor getByEmail no disponible');
        setClients([]);
        return;
      }

      const res = await actions.getByEmail(email);
      const lista = Array.isArray(res) ? (res as Client[]) : [];
      setClients(lista);
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.error('ERROR EN getClientByEmail:', err);
      setClients([]);
      setError(null);
    } finally {
      setLoading(false);
    }
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

      try {
        if (actions?.revalidate) {
          await actions.revalidate();
        } else {
          // Per requirement: do NOT perform client-side revalidation. Signal missing server action.
          setError('Acción del servidor de revalidación no disponible');
        }
      } catch (e) {
        // ignore server revalidate errors but surface a message
        console.error('ERROR EN revalidate:', e);
      }

      form.resetFields();
      setModal((m) => ({ ...m, open: false, editingClient: null }));
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.error('ERROR EN createClient:', err);
      const errorMessage =
        err?.body?.message || err?.body?.error || err?.statusText || 'Ha ocurrido un error al crear el cliente';
      setError(errorMessage);
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

      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      console.error('ERROR EN deleteClient:', err);

      const errorMessage =
        err?.body?.message ||
        err?.body?.error ||
        err?.statusText ||
        'Ha ocurrido un error al eliminar el cliente';

      setError(errorMessage);
    }
  };

  const handleEditClient = (client: Client) => {
    setModal((m) => ({ ...m, open: true, mode: 'edit', editingClient: client, formMounted: false }));
  };

  useEffect(() => {
    if (modal.open && modal.editingClient && modal.formMounted) {
      form.setFieldsValue({
        name: modal.editingClient.name,
        surname: modal.editingClient.surname,
        email: modal.editingClient.email,
        phone: modal.editingClient.phone,
        cifNifNie: modal.editingClient.cifNifNie,
      });
    }
    if (modal.open && !modal.editingClient && modal.formMounted) {
      form.resetFields();
    }
    if (!modal.open && modal.formMounted) {
      form.resetFields();
    }
  }, [modal.open, modal.editingClient, form, modal.formMounted]);

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

      const updatedClient = updated as Client;

      setClients((prev) => prev.map((c) => (c.id === updatedClient.id ? updatedClient : c)));

      setModal((m) => ({ ...m, open: false, editingClient: null }));
      form.resetFields();
    } catch (err: any) {
      console.error('ERROR EN updateClient:', err);

      const errorMessage =
        err?.body?.message ||
        err?.body?.error ||
        err?.statusText ||
        'Ha ocurrido un error al actualizar el cliente';

      setError(errorMessage);
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

  const handleFillExample = () => {
    const index = exampleIndex;

    form.setFieldsValue({
      name: `nomEjemplo${index}`,
      surname: `apellido${index}`,
      email: `ej${index}@example.com`,
      phone: `60000000${index}`,
      cifNifNie: `X000000${index}A`,
    });

    setExampleIndex((prev) => prev + 1);
  };

  const loadClientMerchants = async (clientId: string) => {
    const jwt = process.env.NEXT_PUBLIC_JWT;
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setMerchantsLoading((s) => ({ ...s, client: true }));

      if (!actions?.listMerchant) {
        setError('Acción del servidor listMerchant no disponible');
        setClientMerchants([]);
        return;
      }

  const merchantsIds = await actions.listMerchant(clientId);
  const lista = Array.isArray(merchantsIds) ? (merchantsIds as string[]) : [];
  setClientMerchants(lista);
  return lista;
    } catch (err: any) {
      console.error('ERROR EN listMerchant:', err);
      const errorMessage =
        err?.body?.message ||
        err?.body?.error ||
        err?.statusText ||
        'Ha ocurrido un error al cargar los merchants del cliente';
      setError(errorMessage);
    } finally {
      setMerchantsLoading((s) => ({ ...s, client: false }));
    }
  };

  const loadAllMerchants = async () => {
    const jwt = process.env.NEXT_PUBLIC_JWT;
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setMerchantsLoading((s) => ({ ...s, all: true }));

      if (!actions?.listMerchants) {
        setError('Acción del servidor listMerchants no disponible');
        setAllMerchants([]);
        return;
      }

      const merchantsResult = await actions.listMerchants();
      const lista = Array.isArray(merchantsResult) ? (merchantsResult as Merchant[]) : [];
      setAllMerchants(lista);
      return lista;
    } catch (err: any) {
      console.error('ERROR EN getMerchants:', err);
      const errorMessage =
        err?.message || 'Ha ocurrido un error al cargar todos los merchants';
      setError(errorMessage);
    } finally {
      setMerchantsLoading((s) => ({ ...s, all: false }));
    }
  };

  const openMerchantsModal = async (client: Client) => {
    setSelectedClient(client);
    setMerchantsModalOpen(true);
    setClientMerchants([]);
    setSelectedMerchantId(undefined);

    
    try {
      const [clientIds, merchantsList] = await Promise.all([loadClientMerchants(client.id), loadAllMerchants()]);

      const merchantsArr: Merchant[] = Array.isArray(merchantsList) ? merchantsList : allMerchants;
      const idsArr: string[] = Array.isArray(clientIds) ? clientIds : [];

      const filtered = idsArr.filter((id) => merchantsArr.some((m) => m.id === id));
      setClientMerchants(filtered);
      
      setAllMerchants(merchantsArr);
    } catch (err) {
      console.error('Error loading merchants for modal:', err);
    }
  };

  const handleLinkMerchant = async () => {
    if (!selectedClient || !selectedMerchantId) return;

    const jwt = process.env.NEXT_PUBLIC_JWT;
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLinkingMerchant(true);

      await Service.getCases('link', {
        signal,
        endPointData: {
          clientId: selectedClient.id,
          merchantId: selectedMerchantId,
        },
        token: jwt,
      });

      await loadClientMerchants(selectedClient.id);
    } catch (err: any) {
      console.error('ERROR EN linkClientToMerchant:', err);
      const errorMessage =
        err?.body?.message ||
        err?.body?.error ||
        err?.statusText ||
        'Ha ocurrido un error al asociar el merchant';
      setError(errorMessage);
    } finally {
      setLinkingMerchant(false);
    }
  };

  const handleNameInputChange = (value: string) => {
    setSearch({ name: value, email: '' });
  };

  const columns: ColumnsType<Client> = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    { title: 'Apellidos', dataIndex: 'surname', key: 'surname' },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Email</span>
          <Input
            size="small"
            placeholder="Escribe un email"
            value={search.email}
            onChange={(e) => setSearch({ name: '', email: e.target.value })}
            onPressEnter={() => handleSearchByEmail()}
            allowClear
            onClear={() => {
              setSearch({ name: '', email: '' });
              handleSearchByEmail('');
            }}
          />
        </div>
      ),
      dataIndex: 'email',
      key: 'email',
    },
    { title: 'Teléfono', dataIndex: 'phone', key: 'phone' },
    { title: 'CIF/NIF/NIE', dataIndex: 'cifNifNie', key: 'cifNifNie' },
    { title: 'Estado', dataIndex: 'status', key: 'status' },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_text, record) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Tooltip title="Editar">
            <Button
              size="small"
              type="default"
              icon={<EditOutlined />}
              onClick={() => handleEditClient(record)}
            />
          </Tooltip>

          <Tooltip title="Eliminar">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteClient(record.id)}
            />
          </Tooltip>

          <Tooltip title="Ver / asociar merchants">
            <Button
              size="small"
              type="dashed"
              icon={<ApartmentOutlined />}
              onClick={() => openMerchantsModal(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

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
                setModal((m) => ({ ...m, open: true, mode: 'create', editingClient: null, formMounted: false }));
                setExampleIndex(1);
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
            <ClientsTable clients={clients} columns={columns} />
          )}
        </div>

        {/* Modal único crear/editar cliente */}
        <Modal
          open={modal.open}
          title={modal.mode === 'create' ? 'Crear cliente' : 'Editar cliente'}
          onCancel={() => {
            setModal((m) => ({ ...m, open: false, editingClient: null, formMounted: false }));
            form.resetFields();
          }}
          footer={null}
        >
          <ClientForm
            form={form}
            mode={modal.mode}
            loading={submitting}
            onSubmit={handleSubmit}
            onFillExample={handleFillExample}
            onMount={() => setModal((m) => ({ ...m, formMounted: true }))}
            onUnmount={() => setModal((m) => ({ ...m, formMounted: false }))}
          />
        </Modal>

        {/* Modal para ver/asociar merchants */}
        <ClientMerchantsModal
          open={merchantsModalOpen}
          client={selectedClient}
          clientMerchants={clientMerchants}
          allMerchants={allMerchants}
          loadingClientMerchants={merchantsLoading.client}
          loadingAllMerchants={merchantsLoading.all}
          selectedMerchantId={selectedMerchantId}
          onChangeSelectedMerchant={setSelectedMerchantId}
          onClose={() => {
            setMerchantsModalOpen(false);
            setSelectedClient(null);
            setClientMerchants([]);
            setSelectedMerchantId(undefined);
          }}
          onLinkMerchant={handleLinkMerchant}
          linkingMerchant={linkingMerchant}
        />
      </div>
    </section>
  );
};

export default Hola;
