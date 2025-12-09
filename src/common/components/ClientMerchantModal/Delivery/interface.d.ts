import type { Client } from '@/domain/client';
import type { Merchant } from '@/domain/merchant';

export interface ClientMerchantsModalProps {
  open: boolean;
  client: Client | null;
  clientMerchants: string[];
  allMerchants: Merchant[];
  loadingClientMerchants: boolean;
  loadingAllMerchants: boolean;
  selectedMerchantId?: string;
  onChangeSelectedMerchant: (value?: string) => void;
  onClose: () => void;
  onLinkMerchant: () => void;
  linkingMerchant: boolean;
}
