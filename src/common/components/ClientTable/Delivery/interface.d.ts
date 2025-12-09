import type { ColumnsType } from 'antd/es/table';
import type { Client } from '@/domain/client';

export interface ClientsTableProps {
  clients: Client[];
  columns: ColumnsType<Client>;
}
