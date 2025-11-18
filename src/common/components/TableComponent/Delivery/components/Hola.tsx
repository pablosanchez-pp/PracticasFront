'use client';

import { useEffect, useState } from 'react';
import Service from '@/service/src';
import type { Client } from '@/domain/client';

import { Table, Spin, Alert, Typography, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title, Paragraph } = Typography;

const Hola = () => {
  const [clients, setClients] = useState<Client[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [nameSearchText, setNameSearchText] = useState('');
  const [emailSearchText, setEmailSearchText] = useState('');

  const handleSearchByName = (term?: string) => {
    setEmailSearchText('');

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
    setNameSearchText('');

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
  ];

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    setError(null);

    Service.getCases('getClients', {
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

  return (
    <section className="space-y-4">
      {/* Cabecera */}
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
          <Table<Client>
            rowKey="email"
            columns={columns}
            dataSource={clients}
            locale={{ emptyText: 'No hay clientes.' }}
            pagination={false}
          />
        )}
      </div>
    </section>
  );
};

export default Hola;
