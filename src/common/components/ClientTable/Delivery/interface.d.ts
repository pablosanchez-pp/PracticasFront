import type { Client } from '@/domain/client';

export interface ClientsTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onOpenMerchants: (client: Client) => void;
  // Email search controls (the name search input stays in the page header)
  searchEmail: string;
  onEmailChange: (value: string) => void;
  onEmailPressEnter: () => void;
  onEmailClear: () => void;
}
