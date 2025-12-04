 'use client';

import { useEffect, useState } from 'react';
import { Spin, Alert, Typography, Input, Button, Modal, Form, Select } from 'antd';
import type { Merchant } from '@/domain/merchant';
import { MERCHANT_TYPES } from '@/domain/merchant';
import type { Client } from '@/domain/client';
import MerchantsTable from '../components/TableComponent/Delivery/components/MerchantsTable';
import Service from '@/service/src';

const { Title } = Typography;

type MerchantFormValues = {
  name: string;
  address: string;
  merchantType: string;
};

type MerchantsPageActions = {
  list?: () => Promise<any>;
  getById?: (id: string) => Promise<any>;
  getByName?: (query: string) => Promise<any>;
  getClientsOfMerchant?: (merchantId: string) => Promise<string[] | string | null>;
  getClientById?: (id: string) => Promise<any>;
  revalidate?: () => Promise<void>;
};


const fetchClientById = async (
  id: string,
  actions?: { getClientById?: (id: string) => Promise<any> }
): Promise<Client | null> => {
  if (!actions?.getClientById) {
    console.error('fetchClientById: server action getClientById not provided');
    return null;
  }

  try {
    const c = await actions.getClientById(id);
    return (c as Client) ?? null;
  } catch (err) {
    console.error('fetchClientById error:', err);
    return null;
  }
};

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

const MerchantsPage: React.FC<{ initialMerchants?: Merchant[]; actions?: MerchantsPageActions }> = ({
  initialMerchants,
  actions,
}) => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const [modal, setModal] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    editingMerchant: Merchant | null;
    formMounted: boolean;
  }>({ open: false, mode: 'create', editingMerchant: null, formMounted: false });
  const [form] = Form.useForm<MerchantFormValues>();
  const [exampleIndex, setExampleIndex] = useState(1);
  const [search, setSearch] = useState({ name: '' });
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    if (modal.open && modal.editingMerchant && modal.formMounted) {
      form.setFieldsValue({
        name: modal.editingMerchant.name,
        address: modal.editingMerchant.address,
        merchantType: modal.editingMerchant.merchantType,
      });
    }

    if (modal.open && !modal.editingMerchant && modal.formMounted) {
      form.resetFields();
    }

    if (!modal.open && modal.formMounted) {
      form.resetFields();
    }
  }, [modal.open, modal.editingMerchant, modal.formMounted, form]);

  const handleSearchByName = async (term?: string) => {
    setLoading(true);
    setError(null);

    const name = (term ?? search.name).trim();
    try {
      if (!name) {
        if (!actions?.list) {
          setError('Acción del servidor list no disponible');
          setMerchants([]);
          return;
        }
        const res = await actions.list();
        const lista = Array.isArray(res) ? (res as Merchant[]) : [];
        setMerchants(lista);
        return;
      }

      if (!actions?.getByName) {
        setError('Acción del servidor getByName no disponible');
        setMerchants([]);
        return;
      }

      const res = await actions.getByName(name);
      const lista = Array.isArray(res) ? (res as Merchant[]) : [];
      setMerchants(lista);
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.error('ERROR EN getMerchantsByName:', err);

      const status = err?.status || err?.body?.status;
      if (status === 404 || status === 500) {
        setMerchants([]);
        setError(null);
        return;
      }

      const errorMessage = err?.body?.message || err?.body?.error || err?.statusText || 'Ha ocurrido un error al cargar los merchants';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModal({ open: true, mode: 'create', editingMerchant: null, formMounted: false });
    setExampleIndex(1);
  };

  const openEditModal = (merchant: Merchant) => {
    setModal({ open: true, mode: 'edit', editingMerchant: merchant, formMounted: false });
  };

  const handleModalCancel = () => {
    setModal({ open: false, mode: 'create', editingMerchant: null, formMounted: false });
  };

  const handleModalOk = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const values = await form.validateFields();

      if (modal.mode === 'edit' && modal.editingMerchant) {
        const jwt = process.env.NEXT_PUBLIC_JWT;
        await Service.getCases('updateMerchant', {
          signal: undefined,
          endPointData: { id: modal.editingMerchant.id, ...values },
          token: jwt,
        });

        setMerchants((prev) => prev.map((m) => (m.id === modal.editingMerchant!.id ? ({ ...m, ...values } as Merchant) : m)));
      } else {
        const jwt = process.env.NEXT_PUBLIC_JWT;
        await Service.getCases('createMerchant', {
          signal: undefined,
          endPointData: values,
          token: jwt,
        });

        try {
          if (actions?.revalidate) {
            await actions.revalidate();
          } else {
            setError('Acción del servidor de revalidación no disponible');
          }
        } catch (e) {
          console.error('ERROR EN revalidate (merchant):', e);
        }
      }

      setModal((m) => ({ ...m, open: false, editingMerchant: null }));
      form.resetFields();
    } catch (err: any) {
      if (err?.errorFields) return;
      setError(err?.message ?? 'Error saving merchant');
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
    } catch (err: any) {
      console.error('ERROR EN deleteMerchant:', err);
      const errorMessage = err?.body?.message || err?.body?.error || err?.statusText || 'Ha ocurrido un error al eliminar el merchant';
      setError(errorMessage);
    }
  };

  const handleFillExample = () => {
    const index = exampleIndex;

    if (modal.formMounted) {
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
      type MerchantsPageActions = {
        list?: () => Promise<any>;
        getById?: (id: string) => Promise<any>;
        getByName?: (query: string) => Promise<any>;
        getClientsOfMerchant?: (merchantId: string) => Promise<string[] | string>;
        getClientById?: (id: string) => Promise<any>;
        revalidate?: () => Promise<void>;
      };

      if (!actions?.getClientsOfMerchant) {
        setError('Acción del servidor getClientsOfMerchant no disponible');
        return;
      }

      const result = await actions.getClientsOfMerchant(merchant.id);
      let clientIds: string[] = [];

      if (Array.isArray(result)) {
        clientIds = result as string[];
      } else if (result == null) {
        clientIds = [];
      } else if (typeof result === 'string') {
        const str = result as string;
        const looksLikeId = /^[0-9a-zA-Z-]{6,}$/.test(str);
        if (looksLikeId) {
          clientIds = [str];
        } else {
          Modal.info({ title: 'Clientes asociados', content: <p>{str}</p> });
          return;
        }
      } else {
        Modal.info({ title: 'Clientes asociados', content: <p>Este merchant no tiene clientes asociados</p> });
        return;
      }

      if (!clientIds.length) {
        Modal.info({ title: 'Cliente asociado', content: <p>Este merchant no tiene clientes asociados</p> });
        return;
      }

      const settled = await Promise.allSettled(clientIds.map((id) => fetchClientById(id, actions)));

      const clients: Client[] = settled
        .filter((r) => r.status === 'fulfilled')
        .map((r) => (r as PromiseFulfilledResult<Client | null>).value)
        .filter((c): c is Client => c !== null && c !== undefined);

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

      <MerchantsTable merchants={merchants} loading={loading} onEdit={openEditModal} onDelete={(m) => handleDeleteMerchant(m.id)} onShowClient={handleShowClient} />

  <Modal open={modal.open} title={modal.editingMerchant ? 'Edit merchant' : 'Create merchant'} onCancel={handleModalCancel} onOk={handleModalOk}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button type="dashed" onClick={handleFillExample}>
            Rellenar datos de ejemplo
          </Button>
        </div>

  <FormWrapper onMount={() => setModal((m) => ({ ...m, formMounted: true }))} onUnmount={() => setModal((m) => ({ ...m, formMounted: false }))}>
          <Form form={form} layout="vertical">
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter name' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please enter address' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Type" name="merchantType" rules={[{ required: true, message: 'Please select type' }]}>
              <Select options={MERCHANT_TYPES} placeholder="Select a merchant type" />
            </Form.Item>
          </Form>
        </FormWrapper>
      </Modal>
    </div>
  );
};

export default MerchantsPage;
