'use client';

import { Form, Input, Select, Button } from 'antd';
import { MERCHANT_TYPES, type Merchant } from '@/domain/merchant';
import Service from '@/service/src';

interface Props {
  onCreated?: () => void; 
}

const MerchantCreateForm: React.FC<Props> = ({ onCreated }) => {
  const [form] = Form.useForm<Merchant>();

  const onFinish = async (values: Merchant) => {
    const jwt = process.env.NEXT_PUBLIC_JWT;
    const controller = new AbortController();
    const signal = controller.signal;

    await Service.getCases('createMerchant', {
      signal,
      endPointData: values,
      token: jwt,
    });

    form.resetFields();
    if (onCreated) onCreated();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 400 }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please enter name' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true, message: 'Please enter address' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Type"
        name="merchantType"
        rules={[{ required: true, message: 'Please select type' }]}
      >
        <Select
          options={MERCHANT_TYPES}
          placeholder="Select a merchant type"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create merchant
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MerchantCreateForm;
