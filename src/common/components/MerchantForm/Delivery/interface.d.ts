import type { Merchant } from '@/domain/merchant';

export interface MerchantFormProps {
  initialValues?: Pick<Merchant, 'name' | 'address' | 'merchantType'>;
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
  onClose?: () => void;
  editingId?: string;
}

export type MerchantFormValues = Pick<Merchant, 'name' | 'address' | 'merchantType'>;
