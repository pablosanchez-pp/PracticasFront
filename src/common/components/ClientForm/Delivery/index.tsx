'use client';

import { Form, Input, Button } from 'antd';
import { useEffect, useState } from 'react';
import type { Client } from '@/domain/client';

export type ClientFormValues = Pick<
  Client,
  'name' | 'surname' | 'email' | 'phone' | 'cifNifNie'
>;

interface ClientFormProps {
  initialValues?: ClientFormValues;
  mode?: 'create' | 'edit';
  loading?: boolean;
  onSubmit?: (values: ClientFormValues) => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ initialValues, mode = 'create', loading = false, onSubmit }) => {
  const [form] = Form.useForm<ClientFormValues>();
  const [exampleIndex, setExampleIndex] = useState(1);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFillExample = () => {
    const index = exampleIndex;
    form.setFieldsValue({
      name: `nomEjemplo${index}`,
      surname: `apellido${index}`,
      email: `ej${index}@example.com`,
      phone: `60000000${index}`,
      cifNifNie: `X000000${index}A`,
    });
    setExampleIndex((prev) => prev + 1);
  };
  return (
    <>
      {/* Botón para rellenar datos de ejemplo */}
      <div className="mb-4 flex justify-end">
        <Button type="dashed" onClick={handleFillExample}>
          Rellenar datos de ejemplo
        </Button>
      </div>

  <Form<ClientFormValues> form={form} layout="vertical" onFinish={(values) => onSubmit && onSubmit(values)}>
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
