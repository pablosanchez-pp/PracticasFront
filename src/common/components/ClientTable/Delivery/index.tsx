'use client';

import { Table, Input, Button, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, ApartmentOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Client } from '@/domain/client';
import type { ClientsTableProps } from './interface';

const ClientsTable = ({
  clients,
  onEdit,
  onDelete,
  onOpenMerchants,
  searchEmail,
  onEmailChange,
  onEmailPressEnter,
  onEmailClear,
}: ClientsTableProps) => {
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
            value={searchEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            onPressEnter={onEmailPressEnter}
            allowClear
            onClear={onEmailClear}
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
            <Button size="small" type="default" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>

          <Tooltip title="Eliminar">
            <Button size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(record.id)} />
          </Tooltip>

          <Tooltip title="Ver / asociar merchants">
            <Button size="small" type="dashed" icon={<ApartmentOutlined />} onClick={() => onOpenMerchants(record)} />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Table<Client>
      rowKey="id"
      columns={columns}
      dataSource={clients}
      locale={{ emptyText: 'No hay clientes.' }}
      pagination={false}
    />
  );
};

export default ClientsTable;
