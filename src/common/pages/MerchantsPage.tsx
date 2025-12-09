 'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {Alert, Typography, Input, Button, Modal, Form} from 'antd';
import type { Merchant } from '@/domain/merchant';
import { MERCHANT_TYPES } from '@/domain/merchant';
import type { Client } from '@/domain/client';
import MerchantsTable from '../components/MerchantTable/Delivery';
import MerchantForm from '../components/MerchantForm/Delivery';
import Service from '@/service/src';
import { getErrorMessage, isAbortError, getErrorStatus } from '@/common/utils/errorHelpers';
import MerchantClientsModal from '@/common/components/MerchantClientsModal/Delivery';

const { Title } = Typography;

type MerchantFormValues = {
  name: string;
  address: string;
  merchantType: string;
};

type MerchantsPageActions = {
  list?: () => Promise<Merchant[]>;
  getById?: (id: string) => Promise<Merchant | null>;
  getByName?: (query: string) => Promise<Merchant[]>;
  getClientsOfMerchant?: (merchantId: string) => Promise<string[] | string | null>;
  getClientById?: (id: string) => Promise<Client | null>;
};

const MerchantsPage: React.FC<{ initialMerchants?: Merchant[]; actions?: MerchantsPageActions }> = ({initialMerchants,actions,}) => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    editingMerchant: Merchant | null;
  }>({ open: false, mode: 'create', editingMerchant: null });
  const [form] = Form.useForm<MerchantFormValues>();
  const [exampleIndex, setExampleIndex] = useState(1);
  const [search, setSearch] = useState({ name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [clientsModalOpen, setClientsModalOpen] = useState(false);
  const [selectedMerchantForClients, setSelectedMerchantForClients] = useState<Merchant | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (initialMerchants && Array.isArray(initialMerchants)) {
      setMerchants(initialMerchants);
      setLoading(false);
      setError(null);
      return;
    }
    setMerchants([]);
    setLoading(false);
    setError('No hay acción del servidor para obtener merchants');
  }, [initialMerchants]);

  useEffect(() => {
    if (modal.open && modal.editingMerchant) {
      form.setFieldsValue({
        name: modal.editingMerchant.name,
        address: modal.editingMerchant.address,
        merchantType: modal.editingMerchant.merchantType,
      });
      return;
    }

    if (modal.open && !modal.editingMerchant) {
      form.resetFields();
      return;
    }

    if (!modal.open) {
      form.resetFields();
    }
  }, [modal.open, modal.editingMerchant, form]);

  const handleSearchByName = async (term?: string) => {
    setSearch((s) => ({ ...s }));
    const name = (term ?? search.name).trim();
    const base = '/merchants';
    if (!name) {
      router.replace(base);
      return;
    }
    router.replace(`${base}?name=${encodeURIComponent(name)}`);
  };

  const openCreateModal = () => {
    setModal({ open: true, mode: 'create', editingMerchant: null });
    setExampleIndex(1);
  };

  const openEditModal = (merchant: Merchant) => {
    setModal({ open: true, mode: 'edit', editingMerchant: merchant });
  };

  const handleModalCancel = () => {
    setModal({ open: false, mode: 'create', editingMerchant: null });
  };

  const handleCreateMerchant = async (values: MerchantFormValues) => {
    const jwt = process.env.NEXT_PUBLIC_JWT;
    await Service.getCases('createMerchant', {
      signal: undefined,
      endPointData: values,
      token: jwt,
    });
    router.refresh();
  };

  const handleUpdateMerchant = async (values: MerchantFormValues) => {
    if (!modal.editingMerchant) return;
    const jwt = process.env.NEXT_PUBLIC_JWT;
    await Service.getCases('updateMerchant', {
      signal: undefined,
      endPointData: { id: modal.editingMerchant.id, ...values },
      token: jwt,
    });

    setMerchants((prev) => prev.map((m) => (m.id === modal.editingMerchant!.id ? ({ ...m, ...values } as Merchant) : m)));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const values = await form.validateFields();

      if (modal.mode === 'edit' && modal.editingMerchant) {
        await handleUpdateMerchant(values);
      } else {
        await handleCreateMerchant(values);
      }

      setModal((m) => ({ ...m, open: false, editingMerchant: null }));
      form.resetFields();
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'errorFields' in err) return;
      setError(getErrorMessage(err, 'Error saving merchant'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMerchant = async (id: Merchant['id']) => {
    const jwt = process.env.NEXT_PUBLIC_JWT;
    setError(null);

    try {
      await Service.getCases('deleteMerchant', {
        signal: undefined,
        endPointData: { id },
        token: jwt,
      });

      setMerchants((prev) => prev.filter((m) => m.id !== id));
    } catch (err: unknown) {
      console.error('ERROR EN deleteMerchant:', err);
      setError(getErrorMessage(err, 'Ha ocurrido un error al eliminar el merchant'));
    }
  };

  const handleFillExample = () => {
    const index = exampleIndex;

    form.setFieldsValue({
      name: `merchantEjemplo${index}`,
      address: `Direccion ejemplo ${index}`,
      merchantType: (MERCHANT_TYPES[0]?.value as string) ?? '',
    });

    setExampleIndex((prev) => prev + 1);
  };

  return (
    <div>
      <Title level={2} style={{ color: 'white' }}>
        Merchants
      </Title>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <Input
          placeholder="Search merchants by name..."
          style={{ maxWidth: 300 }}
          value={search.name}
          onChange={(e) => setSearch({ name: e.target.value })}
          onPressEnter={() => handleSearchByName(search.name)}
          allowClear
          onClear={() => {
            setSearch({ name: '' });
            handleSearchByName('');
          }}
        />
        <Button type="primary" onClick={openCreateModal}>
          Nuevo merchant
        </Button>
      </div>

      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}

      <MerchantsTable 
        merchants={merchants} 
        loading={loading} 
        onEdit={openEditModal} 
        onDelete={(m) => handleDeleteMerchant(m.id)} 
        onShowClient={(m) => {
          setSelectedMerchantForClients(m);
          setClientsModalOpen(true);
        }}
      />

      <MerchantClientsModal
        open={clientsModalOpen}
        merchant={selectedMerchantForClients}
        onClose={() => {
          setClientsModalOpen(false);
          setSelectedMerchantForClients(null);
        }}
      />

      <Modal open={modal.open} title={modal.editingMerchant ? 'Edit merchant' : 'Create merchant'} onCancel={handleModalCancel} onOk={handleSubmit} footer={null}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button type="dashed" onClick={handleFillExample}>
            Rellenar datos de ejemplo
          </Button>
        </div>

        <MerchantForm
          form={form}
          mode={modal.mode}
          loading={submitting}
          onSubmit={handleSubmit}
          onFillExample={handleFillExample}
          
        />
      </Modal>
    </div>
  );
};

export default MerchantsPage;
