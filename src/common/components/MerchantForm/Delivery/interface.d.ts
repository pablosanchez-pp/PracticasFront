import type { Merchant } from '@/domain/merchant';

export interface MerchantFormProps {
  initialValues?: Pick<Merchant, 'name' | 'address' | 'merchantType'>;
  mode?: 'create' | 'edit';
  loading?: boolean;
  onSubmit?: (values: Pick<Merchant, 'name' | 'address' | 'merchantType'>) => void;
  onFillExample?: () => void;
  handleFillExample?: () => void;
}

export type MerchantFormValues = Pick<Merchant, 'name' | 'address' | 'merchantType'>;
