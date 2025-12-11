import type { FormInstance } from 'antd/es/form';
import type { Client } from '@/domain/client';

export type ClientFormValues = Pick<
  Client,
  'name' | 'surname' | 'email' | 'phone' | 'cifNifNie'
>;

export interface ClientFormProps {
  initialValues?: ClientFormValues;
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
  onClose?: () => void;
  editingId?: string;
}
