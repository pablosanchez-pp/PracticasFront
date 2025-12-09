import type { Merchant } from '@/domain/merchant';

export interface MerchantCreateFormProps {
  onCreated?: () => void;
}

export type MerchantFormValues = Pick<Merchant, 'name' | 'address' | 'merchantType'>;
