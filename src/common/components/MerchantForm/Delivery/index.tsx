"use client";

import { Form, Input, Select, Button, Alert } from 'antd';
import { useState, useEffect } from 'react';
import { MERCHANT_TYPES } from '@/domain/merchant';
import type { MerchantFormValues, MerchantFormProps } from './interface';
import { createMerchant, updateMerchant } from '../Infrastructure/requests';

const MerchantCreateForm: React.FC<MerchantFormProps> = ({ initialValues, mode = 'create', onSuccess, onClose, editingId }) => {
  const [form] = Form.useForm<MerchantFormValues>();
  const [exampleIndex, setExampleIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      name: `merchantEjemplo${index}`,
      address: `Direccion ejemplo ${index}`,
      merchantType: (MERCHANT_TYPES[0]?.value as string) ?? '',
    });
    setExampleIndex((p) => p + 1);
  };

  const onFinish = async (values: MerchantFormValues) => {
    setError(null);
    setLoading(true);
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      if (mode === 'create') {
        await createMerchant(values, signal);
      } else {
        if (!editingId) throw new Error('Missing id for update');
        await updateMerchant(editingId, values, signal);
      }
      onSuccess?.();
      onClose?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button type="dashed" onClick={handleFillExample}>
          Rellenar datos de ejemplo
        </Button>
      </div>

  <Form<MerchantFormValues> form={form} initialValues={initialValues} layout="vertical" onFinish={onFinish}>
      {error && (
        <div style={{ marginBottom: 12 }}>
          <Alert type="error" message={error} />
        </div>
      )}
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter name' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="address"
        label="Address"
        rules={[{ required: true, message: 'Please enter address' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="merchantType"
        label="Type"
        rules={[{ required: true, message: 'Please select type' }]}
      >
        <Select options={MERCHANT_TYPES} placeholder="Select a merchant type" />
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

export default MerchantCreateForm;
