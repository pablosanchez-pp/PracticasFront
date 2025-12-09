import type { Merchant } from '@/domain/merchant';

export interface MerchantsTableProps {
  merchants: Merchant[];
  loading: boolean;
  onEdit: (merchant: Merchant) => void;
  onDelete?: (merchant: Merchant) => void;
  onShowClient?: (merchant: Merchant) => void;
}
