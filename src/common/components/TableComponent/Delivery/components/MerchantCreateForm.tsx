'use client';

import { Form, Input, Select, Button } from 'antd';
import { MERCHANT_TYPES } from '@/domain/merchant';
import { createMerchant, type NewMerchant } from '@/service/src/application/queries/getMerchants';

interface Props {
  onCreated?: () => void; // para recargar la lista después de crear
}

const MerchantCreateForm: React.FC<Props> = ({ onCreated }) => {
  const [form] = Form.useForm<NewMerchant>();

  const onFinish = async (values: NewMerchant) => {
    await createMerchant(values);
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
