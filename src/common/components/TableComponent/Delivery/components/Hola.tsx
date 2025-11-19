'use client';

import { useState } from 'react';
import Service from '@/service/src';
import type { Client } from '@/domain/client';

import { Spin, Alert, Typography, Input, Button, Form } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { useClients } from './useClients';
import ClientsTable from './ClientsTable';
import { deleteClient } from '@/service/src/application/queries/getClients';

const { Title, Paragraph } = Typography;

type NewClientFormValues = Pick<
  Client,
  'name' | 'surname' | 'email' | 'phone' | 'cifNifNie'
>;

const Hola = () => {
  const { clients, setClients, loading, setLoading, error, setError } =
    useClients();

  const [nameSearchText, setNameSearchText] = useState('');
  const [emailSearchText, setEmailSearchText] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm<NewClientFormValues>();

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

  const handleCreateClient = (values: NewClientFormValues) => {
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
        setShowCreateForm(false);
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
    const confirmed = window.confirm('¿Seguro que quieres eliminar este cliente?');
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
        <Button danger onClick={() => handleDeleteClient(record.id)}>
          Eliminar
        </Button>
      ),
    },
  ];


  return (
    <section className="space-y-4">
      {/* Cabecera + botón crear */}
      <div className="flex items-center justify-between">
        <div>
          <Title
            level={2}
            style={{ marginBottom: 4, color: '#ffffff' }}
          >
            Clientes
          </Title>
          <Paragraph type="secondary" style={{ margin: 0, color: '#ffffff' }}>
            Listado de clientes obtenidos del microservicio.
          </Paragraph>
        </div>

        <Button
          type="primary"
          onClick={() => setShowCreateForm((prev) => !prev)}
        >
          {showCreateForm ? 'Cancelar' : 'Nuevo cliente'}
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

      {/* Formulario crear cliente */}
      {showCreateForm && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <Typography.Title level={4} style={{ marginBottom: 16 }}>
            Crear cliente
          </Typography.Title>

          <Form<NewClientFormValues>
            form={form}
            layout="inline"
            onFinish={handleCreateClient}
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Introduce el nombre' }]}
            >
              <Input placeholder="Nombre" />
            </Form.Item>

            <Form.Item
              name="surname"
              rules={[{ required: true, message: 'Introduce los apellidos' }]}
            >
              <Input placeholder="Apellidos" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Introduce el email' }]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item name="phone">
              <Input placeholder="Teléfono" />
            </Form.Item>

            <Form.Item name="cifNifNie">
              <Input placeholder="CIF/NIF/NIE" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={creating}>
                Guardar
              </Button>
            </Form.Item>
          </Form>
        </div>
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
    </section>
  );
};

export default Hola;
