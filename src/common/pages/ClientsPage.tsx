'use client';

import { useState, useRef, useEffect } from 'react';
import Service from '@/service/src';
import type { Client } from '@/domain/client';
import type { Merchant } from '@/domain/merchant';

import { Spin, Alert, Typography, Input, Button, Form, Tooltip, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import ClientsTable from '../components/TableComponent/Delivery/components/ClientsTable';

import { DeleteOutlined, EditOutlined, ApartmentOutlined } from '@ant-design/icons';

import ClientForm, { ClientFormValues } from '../components/TableComponent/Delivery/components/ClientForm';
import ClientMerchantsModal from '../components/TableComponent/Delivery/components/ClientMerchantsModals';
import { revalidatePath } from 'next/cache';

const { Title } = Typography;

const Hola = () => {
  // Inline useClients state and logic to remove dependency on the external hook
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load clients on mount (same behavior as the previous useClients hook)
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);

    Service.getCases('getClient', {
      signal,
      endPointData: {},
      token: process.env.NEXT_PUBLIC_JWT,
    })
      .then((res) => {
        const lista = Array.isArray(res) ? (res as Client[]) : [];
        setClients(lista);
      })
      .catch((err: any) => {
        if (err?.name === 'AbortError') return;
        console.error('ERROR EN getClients:', err);

        const errorMessage =
          err?.body?.message ||
          err?.body?.error ||
          err?.statusText ||
          'Ha ocurrido un error al cargar los clientes';

        setError(errorMessage);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const [nameSearchText, setNameSearchText] = useState('');
  const [emailSearchText, setEmailSearchText] = useState('');
  const [form] = Form.useForm<ClientFormValues>();
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [submitting, setSubmitting] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formMounted, setFormMounted] = useState(false);

  const [exampleIndex, setExampleIndex] = useState(1);

  const [merchantsModalOpen, setMerchantsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [clientMerchants, setClientMerchants] = useState<string[]>([]);
  const [loadingClientMerchants, setLoadingClientMerchants] = useState(false);

  const [allMerchants, setAllMerchants] = useState<Merchant[]>([]);
  const [loadingAllMerchants, setLoadingAllMerchants] = useState(false);

  const [selectedMerchantId, setSelectedMerchantId] = useState<string | undefined>(undefined);
  const [linkingMerchant, setLinkingMerchant] = useState(false);

  const searchNameTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --------------------------------------------------

  const handleSearchByName = (term?: string) => {
    setEmailSearchText(''); // al buscar por nombre, limpio el email

    const jwt = process.env.NEXT_PUBLIC_JWT;
    const name = (term ?? nameSearchText).trim();

    setError(null);

    const controller = new AbortController();
    const signal = controller.signal;

    const serviceName = name ? 'getClientByName' : 'getClient';
    const endPointData = name ? { query: name } : {};

    Service.getCases(serviceName, {
      signal,
      endPointData,
      token: jwt,
    })
      .then((res) => {
        const lista = Array.isArray(res) ? (res as Client[]) : [];
        setClients(lista);
      })
      .catch((err: any) => {
        if (err?.name === 'AbortError') return;
        console.error('ERROR EN getClientsByName:', err);

        const errorMessage =
          err?.body?.message ||
          err?.body?.error ||
          err?.statusText ||
          'Ha ocurrido un error al cargar los clientes';

        setError(errorMessage);
      });
  };

  const handleSearchByEmail = (term?: string) => {
    setNameSearchText(''); // al buscar por email, limpio el nombre

    const jwt = process.env.NEXT_PUBLIC_JWT;
    const email = (term ?? emailSearchText).trim();

    setError(null);
    setLoading(true);

    const controller = new AbortController();
    const signal = controller.signal;

    const serviceName = email ? 'getClientByEmail' : 'getClient';
    const endPointData = email ? { email } : {};

    Service.getCases(serviceName, {
      signal,
      endPointData,
      token: jwt,
    })
      .then((res) => {
        const lista = Array.isArray(res) ? (res as Client[]) : [];
        setClients(lista);
      })
      .catch((err: any) => {
        if (err?.name === 'AbortError') return;
        console.error('ERROR EN getClientByEmail:', err);

        if (err?.status === 500) {
          setClients([]);
          setError(null);
          return;
        }

        const errorMessage =
          err?.body?.message ||
          err?.body?.error ||
          err?.statusText ||
          'Ha ocurrido un error al cargar los clientes';

        setError(errorMessage);
      })
      .finally(() => setLoading(false));
  };

  const handleCreateClient = (values: ClientFormValues) => {
    const jwt = process.env.NEXT_PUBLIC_JWT;
    const controller = new AbortController();
    const signal = controller.signal;

    setError(null);
    setSubmitting(true);
    (async () => {
      try {
        await Service.getCases('createClient', {
          signal,
          endPointData: values,
          token: jwt,
        });

        // reload clients list after successful create
        try {
          const reloadController = new AbortController();
          const reloadSignal = reloadController.signal;
          const res = await Service.getCases('getClient', {
            signal: reloadSignal,
            endPointData: {},
            token: jwt,
          });
          const lista = Array.isArray(res) ? (res as Client[]) : [];
          setClients(lista);
        } catch (e) {
          // ignore reload errors
        }

        form.resetFields();
        setModalOpen(false);
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.error('ERROR EN createClient:', err);
        const errorMessage =
          err?.body?.message || err?.body?.error || err?.statusText || 'Ha ocurrido un error al crear el cliente';
        setError(errorMessage);
      } finally {
        setSubmitting(false);
      }
    })();
  };

  const handleDeleteClient = async (id: Client['id']) => {
    const confirmed = window.confirm('¿Seguro que quieres eliminar este cliente?');
    if (!confirmed) return;

    const jwt = process.env.NEXT_PUBLIC_JWT;
    const controller = new AbortController();
    const signal = controller.signal;

    setError(null);

    try {
      await Service.getCases('deleteClient', {
        signal,
        endPointData:{id},
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
    setEditingClient(client);
    setMode('edit');
    // Open modal first; set fields when the form is mounted (see useEffect below)
    setModalOpen(true);
  };

  // When modal opens and the form component is mounted, populate the form.
  useEffect(() => {
    if (modalOpen && editingClient && formMounted) {
      form.setFieldsValue({
        name: editingClient.name,
        surname: editingClient.surname,
        email: editingClient.email,
        phone: editingClient.phone,
        cifNifNie: editingClient.cifNifNie,
      });
    }
    // For create mode: when the modal opens and the form is mounted, reset the form
    if (modalOpen && !editingClient && formMounted) {
      form.resetFields();
    }
    if (!modalOpen && formMounted) {
      // reset form when modal closes to avoid stale data
      form.resetFields();
    }
  }, [modalOpen, editingClient, form, formMounted]);

  const handleUpdateClient = async (values: ClientFormValues) => {
    if (!editingClient) return;

    const jwt = process.env.NEXT_PUBLIC_JWT;
    const controller = new AbortController();
    const signal = controller.signal;

  setError(null);
  setSubmitting(true);

    try {
      const updated = await Service.getCases('updateClient', {
        signal,
        endPointData: {
          id: editingClient.id,
          name: values.name,
          surname: values.surname,
          email: values.email,
          phone: values.phone,
          cifNifNie: values.cifNifNie,
        },
        token: jwt,
      });

      const updatedClient = updated as Client;

      setClients((prev) =>
        prev.map((c) => (c.id === updatedClient.id ? updatedClient : c)),
      );

      setModalOpen(false);
      setEditingClient(null);
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
    if (mode === 'create') {
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
      setLoadingClientMerchants(true);
      const merchantsIds = await Service.getCases('listMerchant', {
        signal,
        endPointData: { clientId },
        token: jwt,
      });

      const lista = Array.isArray(merchantsIds) ? (merchantsIds as string[]) : [];
      setClientMerchants(lista);
    } catch (err: any) {
      console.error('ERROR EN listMerchantOfClient:', err);
      const errorMessage =
        err?.body?.message ||
        err?.body?.error ||
        err?.statusText ||
        'Ha ocurrido un error al cargar los merchants del cliente';
      setError(errorMessage);
    } finally {
      setLoadingClientMerchants(false);
    }
  };

  const loadAllMerchants = async () => {
    const jwt = process.env.NEXT_PUBLIC_JWT;
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLoadingAllMerchants(true);
      const merchants = await Service.getCases('getMerchant', {
        signal,
        endPointData: {},
        token: jwt,
      });

      const lista = Array.isArray(merchants) ? (merchants as Merchant[]) : [];
      setAllMerchants(lista);
    } catch (err: any) {
      console.error('ERROR EN getMerchants:', err);
      const errorMessage =
        err?.message || 'Ha ocurrido un error al cargar todos los merchants';
      setError(errorMessage);
    } finally {
      setLoadingAllMerchants(false);
    }
  };

  const openMerchantsModal = async (client: Client) => {
    setSelectedClient(client);
    setMerchantsModalOpen(true);
    setClientMerchants([]);
    setSelectedMerchantId(undefined);

    await Promise.all([loadClientMerchants(client.id), loadAllMerchants()]);
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
    setNameSearchText(value);

    if (searchNameTimeoutRef.current) {
      clearTimeout(searchNameTimeoutRef.current);
    }

    searchNameTimeoutRef.current = setTimeout(() => {
      handleSearchByName(value);
    }, 300);
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
            value={emailSearchText}
            onChange={(e) => setEmailSearchText(e.target.value)}
            onPressEnter={() => handleSearchByEmail()}
            allowClear
            onClear={() => {
              setEmailSearchText('');
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
              value={nameSearchText}
              onChange={(e) => handleNameInputChange(e.target.value)}
              allowClear
              className="w-full max-w-xs"
            />

            {/* Botón pequeño pegado a la derecha */}
            <Button
              type="primary"
              onClick={() => {
                setMode('create');
                setEditingClient(null);
                  // Open modal first; reset the form when the form component mounts
                  setModalOpen(true);
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
          open={modalOpen}
          title={mode === 'create' ? 'Crear cliente' : 'Editar cliente'}
          onCancel={() => {
            setModalOpen(false);
            setEditingClient(null);
            form.resetFields();
          }}
          footer={null}
        >
          <ClientForm
            form={form}
            mode={mode}
            loading={submitting}
            onSubmit={handleSubmit}
            onFillExample={handleFillExample}
            onMount={() => setFormMounted(true)}
            onUnmount={() => setFormMounted(false)}
          />
        </Modal>

        {/* Modal para ver/asociar merchants */}
        <ClientMerchantsModal
          open={merchantsModalOpen}
          client={selectedClient}
          clientMerchants={clientMerchants}
          allMerchants={allMerchants}
          loadingClientMerchants={loadingClientMerchants}
          loadingAllMerchants={loadingAllMerchants}
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
