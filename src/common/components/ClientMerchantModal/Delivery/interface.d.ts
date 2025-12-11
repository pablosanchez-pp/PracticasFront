import type { Client } from '@/domain/client';

export interface ClientMerchantsModalProps {
  open: boolean;
  client: Client | null;
  onClose: () => void;
}
