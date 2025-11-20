'use client';

import { useState, useMemo } from 'react';
import Service from '@/service/src';
import type { Client } from '@/domain/client';

import {Spin,Alert,Typography,Input,Button,Form,Tooltip,Modal,Pagination} from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { useClients } from './useClients';
import ClientsTable from './ClientsTable';
import {deleteClient,updateClient} from '@/service/src/application/queries/getClients';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

type ClientFormValues = Pick<
  Client,
  'name' | 'surname' | 'email' | 'phone' | 'cifNifNie'
>;

const Hola = () => {
  const { clients, setClients, loading, setLoading, error, setError } =
    useClients();

  const [nameSearchText, setNameSearchText] = useState('');
  const [emailSearchText, setEmailSearchText] = useState('');

  const [form] = Form.useForm<ClientFormValues>();
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleSearchByName = (term?: string) => {
      setEmailSearchText(''); // al buscar por nombre, limpio el email

      const jwt = process.env.NEXT_PUBLIC_JWT;
      const name = (term ?? nameSearchText).trim();

      setError(null);
      setLoading(true);

      const controller = new AbortController();
      const signal = controller.signal;

      const serviceName = name ? 'getClientsByName' : 'getClients';
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
        })
        .finally(() => setLoading(false));
  };

  const handleSearchByEmail = (term?: string) => {
      setNameSearchText(''); // al buscar por email, limpio el nombre

      const jwt = process.env.NEXT_PUBLIC_JWT;
      const email = (term ?? emailSearchText).trim();

      setError(null);
      setLoading(true);

      const controller = new AbortController();
      const signal = controller.signal;

      const serviceName = email ? 'getClientsByEmail' : 'getClients';
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
          console.error('ERROR EN getClientsByEmail:', err);

          // si tu backend devuelve 500 cuando no hay resultado
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
      setCreating(true);

      Service.getCases('createClient', {
        signal,
        endPointData: values, // { name, surname, email, phone, cifNifNie }
        token: jwt,
      })
        .then(() => {
          // después de crear, recargamos toda la lista de clientes
          return Service.getCases('getClients', {
            signal,
            endPointData: {},
            token: jwt,
          });
        })
        .then((res) => {
          const lista = Array.isArray(res) ? (res as Client[]) : [];
          setClients(lista);
          form.resetFields();
          setModalOpen(false);
        })
        .catch((err: any) => {
          if (err?.name === 'AbortError') return;
          console.error('ERROR EN createClient:', err);

          const errorMessage =
            err?.body?.message ||
            err?.body?.error ||
            err?.statusText ||
            'Ha ocurrido un error al crear el cliente';

          setError(errorMessage);
        })
        .finally(() => setCreating(false));
  };

  const handleDeleteClient = async (id: Client['id']) => {
    const confirmed = window.confirm(
      '¿Seguro que quieres eliminar este cliente?',
    );
    if (!confirmed) return;

    try {
      await deleteClient(id);
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
    form.setFieldsValue({
      name: client.name,
      surname: client.surname,
      email: client.email,
      phone: client.phone,
      cifNifNie: client.cifNifNie,
    });
    setModalOpen(true);
  };

  const handleUpdateClient = async (values: ClientFormValues) => {
    if (!editingClient) return;

    setError(null);
    setUpdating(true);

    try {
      const updated = await updateClient({
        id: editingClient.id,
        name: values.name,
        surname: values.surname,
        email: values.email,
        phone: values.phone,
        cifNifNie: values.cifNifNie,
      });

      setClients((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)),
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
      setUpdating(false);
    }
  };

  const handleSubmit = (values: ClientFormValues) => {
    if (mode === 'create') {
      handleCreateClient(values);
    } else {
      handleUpdateClient(values);
    }
  };

  const columns: ColumnsType<Client> = [
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Nombre</span>
          <Input
            size="small"
            placeholder="Escribe un nombre"
            value={nameSearchText}
            onChange={(e) => setNameSearchText(e.target.value)}
            onPressEnter={() => handleSearchByName()}
            allowClear
            onClear={() => {
              setNameSearchText('');
              handleSearchByName(''); // vuelve a getClients
            }}
          />
        </div>
      ),
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
              handleSearchByEmail(''); // vuelve a getClients
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
        </div>
      ),
    },
  ];

  return (
    <section 
      className="space-y-4 min-h-screen p-6" 
      style={{ backgroundColor: 'bg-slate-800' }}>
      {/* Cabecera + botón crear */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} style={{ marginBottom: 4, color: '#ffffff' }}>
            Clientes
          </Title>
          <Paragraph
            type="secondary"
            style={{ margin: 0, color: '#ffffff' }}
          >
            Listado de clientes obtenidos del microservicio.
          </Paragraph>
        </div>

        <Button
          type="primary"
          onClick={() => {
            setMode('create');
            setEditingClient(null);
            form.resetFields();
            setModalOpen(true);
          }}
        >
          Nuevo cliente
        </Button>
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

      {/* Tabla dentro de una tarjeta blanca */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spin tip="Cargando clientes..." />
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
        destroyOnClose
      >
        <Form<ClientFormValues>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: 'Introduce el nombre' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="surname"
            label="Apellidos"
            rules={[{ required: true, message: 'Introduce los apellidos' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Introduce el email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Teléfono">
            <Input />
          </Form.Item>

          <Form.Item name="cifNifNie" label="CIF/NIF/NIE">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={mode === 'create' ? creating : updating}
              block
            >
              {mode === 'create' ? 'Guardar' : 'Guardar cambios'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default Hola;
