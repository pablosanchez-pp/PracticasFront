'use client';

import { Form, Input, Select, Button } from 'antd';
import { useEffect } from 'react';
import { MERCHANT_TYPES } from '@/domain/merchant';
import type { FormInstance } from 'antd/es/form';

export type MerchantFormValues = {
  name: string;
  address: string;
  merchantType: string;
};

interface MerchantFormProps {
  form: FormInstance<MerchantFormValues>;
  mode: 'create' | 'edit';
  loading: boolean;
  onSubmit: (values: MerchantFormValues) => void;
  onFillExample?: () => void;
}

const MerchantCreateForm: React.FC<MerchantFormProps> = ({ form, mode, loading, onSubmit, onFillExample }) => {

  return (
    <Form<MerchantFormValues> form={form} layout="vertical" onFinish={onSubmit}>
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
  );
};

export default MerchantCreateForm;
