'use client';

import { useState } from 'react';
import {
  Typography,
  Input,
  Alert,
  Button,
  Modal,
  Form,
  Select,
} from 'antd';
import MerchantsTable from './MerchantsTable';
import { useMerchants } from './useMerchants';
import type { Merchant } from '@/domain/merchant';
import { MERCHANT_TYPES } from '@/domain/merchant';

const { Title } = Typography;

type MerchantFormValues = {
  name: string;
  address: string;
  merchantType: string;
};

const MerchantsPage: React.FC = () => {
  const {
    merchants,
    loading,
    error,
    searchByName,
    loadAll,
    addMerchant,
    editMerchant,
    removeMerchant,
    setError,
  } = useMerchants();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [form] = Form.useForm<MerchantFormValues>();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    searchByName(value);
  };

  const openCreateModal = () => {
    setEditingMerchant(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (merchant: Merchant) => {
    setEditingMerchant(merchant);
    form.setFieldsValue({
      name: merchant.name,
      address: merchant.address,
      merchantType: merchant.merchantType,
    });
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingMerchant) {
        // EDITAR
        await editMerchant(editingMerchant.id, {
          name: values.name,
          address: values.address,
          merchantType: values.merchantType,
        });
      } else {
        // CREAR
        await addMerchant({
          name: values.name,
          address: values.address,
          merchantType: values.merchantType,
        });
      }

      setIsModalOpen(false);
      form.resetFields();
      await loadAll();
    } catch (err: any) {
      // si es error de validación del form, no lo mostramos como error global
      if (err?.errorFields) return;
      setError(err?.message ?? 'Error saving merchant');
    }
  };

  return (
    <div>
      {/* 👇 título en blanco */}
      <Title level={2} style={{ color: 'white' }}>
        Merchants
      </Title>

      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 16,
          alignItems: 'center',
        }}
      >
        <Input
          placeholder="Search merchants by name..."
          style={{ maxWidth: 300 }}
          onChange={handleSearchChange}
        />
        <Button type="primary" onClick={openCreateModal}>
          New merchant
        </Button>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          style={{ marginBottom: 16 }}
        />
      )}

      <MerchantsTable
        merchants={merchants}
        loading={loading}
        onEdit={openEditModal}
        onDelete={(merchant) => removeMerchant(merchant.id)}
      />

      <Modal
        open={isModalOpen}
        title={editingMerchant ? 'Edit merchant' : 'Create merchant'}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
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
        </Form>
      </Modal>
    </div>
  );
};

export default MerchantsPage;
