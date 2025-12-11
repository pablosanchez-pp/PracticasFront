"use client";

import { Form, Input, Button, Alert } from 'antd';
import { useEffect, useState } from 'react';
import type { ClientFormValues, ClientFormProps } from './interface';
import { createClient, updateClient } from '../Infrastructure/requests';

const ClientForm: React.FC<ClientFormProps> = ({ initialValues, mode = 'create', onSuccess, onClose, editingId }) => {
  const [form] = Form.useForm<ClientFormValues>();
  const [exampleIndex, setExampleIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const onFinish = async (values: ClientFormValues) => {
    setSubmitError(null);
    setLoading(true);
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      if (mode === 'create') {
        await createClient(values, signal);
      } else {
        if (!editingId) throw new Error('Missing id for update');
        await updateClient(editingId, values, signal);
      }

      onSuccess?.();
      onClose?.();
    } catch (err: unknown) {
      // getErrorMessage handled in infra; err.message contains user friendly text
      setSubmitError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botón para rellenar datos de ejemplo */}
      <div className="mb-4 flex justify-end">
        <Button type="dashed" onClick={handleFillExample}>
          Rellenar datos de ejemplo
        </Button>
      </div>

  <Form<ClientFormValues> form={form} initialValues={initialValues} layout="vertical" onFinish={onFinish}>
      {submitError && (
        <div style={{ marginBottom: 12 }}>
          <Alert type="error" message={submitError} />
        </div>
      )}
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
