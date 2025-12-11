 'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {Alert, Typography, Input, Button, Modal} from 'antd';
import type { Merchant } from '@/domain/merchant';
import type { Client } from '@/domain/client';
import MerchantsTable from '../components/MerchantTable/Delivery';
import MerchantForm from '../components/MerchantForm/Delivery';
import { revalidatePage } from '@/common/utils/revalidatePath';
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
  const loading = false;
  const [error, setError] = useState<string | null>(
    initialMerchants && Array.isArray(initialMerchants) ? null : 'No hay acción del servidor para obtener merchants'
  );

  const [modal, setModal] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    editingMerchant: Merchant | null;
  }>({ open: false, mode: 'create', editingMerchant: null });
  const [search, setSearch] = useState({ name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [clientsModalOpen, setClientsModalOpen] = useState(false);
  const [selectedMerchantForClients, setSelectedMerchantForClients] = useState<Merchant | null>(null);
  const router = useRouter();

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
  };

  const openEditModal = (merchant: Merchant) => {
    setModal({ open: true, mode: 'edit', editingMerchant: merchant });
  };

  const handleModalCancel = () => {
    setModal({ open: false, mode: 'create', editingMerchant: null });
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
        merchants={initialMerchants ?? []} 
        loading={loading} 
        onEdit={openEditModal} 
        onDeleteSuccess={() => revalidatePage('/merchants')}
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

      <Modal open={modal.open} title={modal.editingMerchant ? 'Edit merchant' : 'Create merchant'} onCancel={handleModalCancel} footer={null} destroyOnClose>
        <MerchantForm
          initialValues={modal.editingMerchant ? { name: modal.editingMerchant.name, address: modal.editingMerchant.address, merchantType: modal.editingMerchant.merchantType } : undefined}
          mode={modal.mode}
          editingId={modal.editingMerchant?.id}
          onClose={handleModalCancel}
          onSuccess={() => revalidatePage('/merchants')}
        />
      </Modal>
    </div>
  );
};

export default MerchantsPage;
