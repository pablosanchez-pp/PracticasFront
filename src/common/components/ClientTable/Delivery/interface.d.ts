import type { Client } from '@/domain/client';

export interface ClientsTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDeleteSuccess?: () => void;
  onOpenMerchants: (client: Client) => void;
  searchEmail: string;
  onEmailChange: (value: string) => void;
  onEmailPressEnter: () => void;
  onEmailClear: () => void;
}
