"use client";

import { Form, Input, Select, Button } from 'antd';
import { useState } from 'react';
import { MERCHANT_TYPES } from '@/domain/merchant';
import type { MerchantFormValues, MerchantFormProps } from './interface';

const MerchantCreateForm: React.FC<MerchantFormProps> = ({ initialValues, mode = 'create', loading = false, onSubmit, onFillExample, handleFillExample: handleFillExampleProp }) => {
  const [form] = Form.useForm<MerchantFormValues>();
  const [exampleIndex, setExampleIndex] = useState(1);

  const handleFillExample = () => {
    if (typeof handleFillExampleProp === 'function') {
      handleFillExampleProp();
      return;
    }

    if (typeof onFillExample === 'function') {
      onFillExample();
      return;
    }

    const index = exampleIndex;
    form.setFieldsValue({
      name: `merchantEjemplo${index}`,
      address: `Direccion ejemplo ${index}`,
      merchantType: (MERCHANT_TYPES[0]?.value as string) ?? '',
    });
    setExampleIndex((p) => p + 1);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button type="dashed" onClick={handleFillExample}>
          Rellenar datos de ejemplo
        </Button>
      </div>

  <Form<MerchantFormValues> form={form} initialValues={initialValues} layout="vertical" onFinish={(values) => onSubmit && onSubmit(values)}>
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
