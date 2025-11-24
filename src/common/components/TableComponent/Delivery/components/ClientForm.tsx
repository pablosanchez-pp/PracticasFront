'use client';

import { Form, Input, Button } from 'antd';
import type { Client } from '@/domain/client';
import type { FormInstance } from 'antd/es/form';

export type ClientFormValues = Pick<
  Client,
  'name' | 'surname' | 'email' | 'phone' | 'cifNifNie'
>;

interface ClientFormProps {
  form: FormInstance<ClientFormValues>;
  mode: 'create' | 'edit';
  loading: boolean;
  onSubmit: (values: ClientFormValues) => void;
  onFillExample: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({
  form,
  mode,
  loading,
  onSubmit,
  onFillExample,
}) => {
  return (
    <>
      {/* Botón para rellenar datos de ejemplo */}
      <div className="mb-4 flex justify-end">
        <Button type="dashed" onClick={onFillExample}>
          Rellenar datos de ejemplo
        </Button>
      </div>

      <Form<ClientFormValues> form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="name"
          label="Nombre"
          rules={[{ required: true, message: 'Introduce el nombre' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="surname"
          label="Apellidos"
          rules={[{ required: true, message: 'Introduce los apellidos' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Introduce el email' },
            { type: 'email', message: 'El email no es válido' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="phone" label="Teléfono">
          <Input />
        </Form.Item>

        <Form.Item name="cifNifNie" label="CIF/NIF/NIE">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {mode === 'create' ? 'Guardar' : 'Guardar cambios'}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ClientForm;
