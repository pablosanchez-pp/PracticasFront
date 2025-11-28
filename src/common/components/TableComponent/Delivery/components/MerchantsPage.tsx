'use client';

import { useState, useEffect } from 'react';
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
import type { Client } from '@/domain/client';
import Service from '@/service/src';

const { Title } = Typography;

type MerchantFormValues = {
  name: string;
  address: string;
  merchantType: string;
};

const fetchClientById = async (id: string): Promise<Client> => {
  const jwt = process.env.NEXT_PUBLIC_JWT;
  const controller = new AbortController();
  const signal = controller.signal;

  const client = await Service.getCases('getClientById', {
    signal,
    endPointData: { id },
    token: jwt,
  });

  return client as Client;
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
    getClientForMerchant,
  } = useMerchants();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [form] = Form.useForm<MerchantFormValues>();
  const [formMounted, setFormMounted] = useState(false);

  // Small wrapper to notify when the Form mounts/unmounts so we don't call
  // form methods before the Form is connected to the instance.
  const FormWrapper: React.FC<{
    onMount?: () => void;
    onUnmount?: () => void;
    children: React.ReactNode;
  }> = ({ onMount, onUnmount, children }) => {
    useEffect(() => {
      onMount?.();
      return () => onUnmount?.();
    }, [onMount, onUnmount]);

    return <>{children}</>;
  };

  // Populate/reset form values only when the Form component is mounted
  useEffect(() => {
    if (isModalOpen && editingMerchant && formMounted) {
      form.setFieldsValue({
        name: editingMerchant.name,
        address: editingMerchant.address,
        merchantType: editingMerchant.merchantType,
      });
    }

    if (isModalOpen && !editingMerchant && formMounted) {
      form.resetFields();
    }

    if (!isModalOpen && formMounted) {
      form.resetFields();
    }
  }, [isModalOpen, editingMerchant, formMounted, form]);

  // contador para los datos de ejemplo
  const [exampleIndex, setExampleIndex] = useState(1);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    searchByName(value);
  };

  const openCreateModal = () => {
    setEditingMerchant(null);
    // open modal first; reset the form when the form component mounts
    setIsModalOpen(true);
    setExampleIndex(1);
  };

  const openEditModal = (merchant: Merchant) => {
    setEditingMerchant(merchant);
    // open modal first; populate fields when the form mounts
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingMerchant(null);
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
      // error de validación del form
      if (err?.errorFields) return;
      setError(err?.message ?? 'Error saving merchant');
    }
  };

  const handleFillExample = () => {
    const index = exampleIndex;

    if (formMounted) {
      form.setFieldsValue({
        name: `merchantEjemplo${index}`,
        address: `Direccion ejemplo ${index}`,
        merchantType: (MERCHANT_TYPES[0]?.value as string) ?? '',
      });
    }

    setExampleIndex((prev) => prev + 1);
  };

  const handleShowClient = async (merchant: Merchant) => {
    try {
      const result = await getClientForMerchant(merchant.id);

      const clientIds: string[] = Array.isArray(result)
        ? result
        : result
          ? [result]
          : [];

      if (!clientIds.length) {
        Modal.info({
          title: 'Cliente asociado',
          content: <p>Este merchant no tiene clientes asociados</p>,
        });
        return;
      }

      const clients: Client[] = await Promise.all(
        clientIds.map((id) => fetchClientById(id)),
      );

      Modal.info({
        title: clientIds.length === 1 ? 'Cliente asociado' : 'Clientes asociados',
        content: (
          <div>
            {clients.map((c) => (
              <p key={c.id}>
                {c.name} {c.surname} ({c.email})
              </p>
            ))}
          </div>
        ),
      });
    } catch (err: any) {
      setError(err?.message ?? 'Error getting client of merchant');
    }
  };

  return (
    <div>
      {/* título en blanco */}
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
          Nuevo merchant
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
        onShowClient={handleShowClient}
      />

      <Modal
        open={isModalOpen}
        title={editingMerchant ? 'Edit merchant' : 'Create merchant'}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
      >
        {/* Botón para rellenar datos de ejemplo */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button type="dashed" onClick={handleFillExample}>
            Rellenar datos de ejemplo
          </Button>
        </div>

        {/* FormWrapper notifies when the Form mounts so we don't call form methods too early */}
        <FormWrapper onMount={() => setFormMounted(true)} onUnmount={() => setFormMounted(false)}>
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
        </FormWrapper>
      </Modal>
    </div>
  );
};

export default MerchantsPage;
