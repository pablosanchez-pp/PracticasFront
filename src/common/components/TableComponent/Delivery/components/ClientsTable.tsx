'use client';

import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Client } from '@/domain/client';

type ClientsTableProps = {
  clients: Client[];
  columns: ColumnsType<Client>;
};

const ClientsTable = ({ clients, columns }: ClientsTableProps) => {
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
