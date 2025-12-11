"use client";

import { Table, Button, Tooltip, Modal } from 'antd';

import type { ColumnsType } from 'antd/es/table';
import type { Merchant } from '@/domain/merchant';
import { EditOutlined, DeleteOutlined, UserOutlined} from '@ant-design/icons';
import { deleteMerchant } from '../Infrastructure/requests';

import { MerchantsTableProps } from './interface';

const MerchantsTable: React.FC<MerchantsTableProps> = ({
  merchants,
  loading,
  onEdit,
  onShowClient,
  onDeleteSuccess,
}) => {
  const { confirm } = Modal;

  const handleDelete = (merchant: Merchant) => {
    confirm({
      title: '¿Eliminar merchant?',
      content: 'Esta acción no se puede deshacer.',
      onOk: async () => {
        try {
          await deleteMerchant(merchant.id);
          onDeleteSuccess?.();
        } catch (err: unknown) {
          const msg = (err instanceof Error) ? err.message : 'Error eliminando merchant';
          Modal.error({ title: 'Error', content: msg });
        }
      },
    });
  };
  const columns: ColumnsType<Merchant> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Type',
      dataIndex: 'merchantType',
      key: 'merchantType',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Created',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (value: string) => {
        if (!value) return '';
        const date = new Date(value);
        return date.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      onCell: () => ({
        style: {
          backgroundColor: 'white',
          textAlign: 'center',
        },
      }),
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Tooltip title="Editar merchant">
            <Button
              size="small"
              type="primary"
              ghost              
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>

          <Tooltip title="Borrar merchant">
            <Button
              size="small"
              type="primary"
              danger
              ghost              
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>

          <Tooltip title="Ver cliente asociado">
            <Button
              size="small"
              type="default"
              icon={<UserOutlined />}
              onClick={() => onShowClient && onShowClient(record)}
            />
          </Tooltip>
        </div>
      ),
    }
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={merchants}
      loading={loading}
      pagination={false} 
    />
  );
};

export default MerchantsTable;
