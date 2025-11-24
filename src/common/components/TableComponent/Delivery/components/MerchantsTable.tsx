'use client';

import { Table, Button, Tooltip } from 'antd';

import type { ColumnsType } from 'antd/es/table';
import type { Merchant } from '@/domain/merchant';
import { EditOutlined, DeleteOutlined, UserOutlined} from '@ant-design/icons';

interface MerchantsTableProps {
  merchants: Merchant[];
  loading: boolean;
  onEdit: (merchant: Merchant) => void;
  onDelete?: (merchant: Merchant) => void;
  onShowClient?: (merchant: Merchant) => void;
}

const MerchantsTable: React.FC<MerchantsTableProps> = ({
  merchants,
  loading,
  onEdit,
  onDelete,
  onShowClient,
}) => {
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
              onClick={() => onDelete && onDelete(record)}
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
