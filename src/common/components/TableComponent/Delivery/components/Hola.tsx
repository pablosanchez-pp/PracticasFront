'use client';

import { useEffect, useState } from 'react';
import Service from '@/service/src';
import type { Client } from '@/domain/client';

import { Table, Spin, Alert, Typography, Input, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Hola = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showNameSearch, setShowNameSearch] = useState(false);
  const [nameSearchText, setNameSearchText] = useState('');

  // 👉 ahora acepta un término opcional
  const handleSearchByName = (term?: string) => {
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
        console.error('ERROR EN getClients:', err);

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
          <div className="flex items-center gap-2">
            <span>Nombre</span>
            <SearchOutlined
              style={{ fontSize: 14, cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                if (!showNameSearch) {
                  setShowNameSearch(true);
                } else if (nameSearchText.trim()) {
                  handleSearchByName();
                }
              }}
            />
          </div>

          {showNameSearch && (
            <Input
              size="small"
              placeholder="Escribe un nombre y pulsa Enter..."
              value={nameSearchText}
              onChange={(e) => setNameSearchText(e.target.value)}
              onPressEnter={() => handleSearchByName()}
              allowClear
              
              onClear={() => {
                setNameSearchText('');
                handleSearchByName(''); 
              }}
            />
          )}
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
    },
    { title: 'Apellidos', dataIndex: 'surname', key: 'surname' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
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
      {/* Cabecera + botón reiniciar */}
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

        {showNameSearch && nameSearchText.trim().length > 0 && (
        <Button
          onClick={() => {
            setNameSearchText('');
            setShowNameSearch(false);
            handleSearchByName('');
          }}
        >
          Reiniciar
        </Button>
        )}
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
