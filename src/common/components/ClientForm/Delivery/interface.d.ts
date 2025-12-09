import type { FormInstance } from 'antd/es/form';
import type { Client } from '@/domain/client';

export type ClientFormValues = Pick<
  Client,
  'name' | 'surname' | 'email' | 'phone' | 'cifNifNie'
>;

export interface ClientFormProps {
  form: FormInstance<ClientFormValues>;
  mode: 'create' | 'edit';
  loading: boolean;
  onSubmit: (values: ClientFormValues) => void;
  onFillExample: () => void;
  // Lifecycle hooks moved to Infrastructure; not required here
}
