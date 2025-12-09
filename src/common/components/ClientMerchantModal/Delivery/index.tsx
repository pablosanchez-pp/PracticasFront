'use client';

import { useEffect, useState } from 'react';
import { Modal, Spin, Select, Button, Alert } from 'antd';
import type { Client } from '@/domain/client';
import type { Merchant } from '@/domain/merchant';
import {
  listClientMerchants,
  listAllMerchants,
  linkClientToMerchant,
} from '@/common/components/ClientMerchantModal/Infraestructure/requests';
import { getErrorMessage } from '@/common/utils/errorHelpers';

interface ClientMerchantsModalProps {
  open: boolean;
  client: Client | null;
  onClose: () => void;
}

const ClientMerchantsModal: React.FC<ClientMerchantsModalProps> = ({ open, client, onClose }) => {
  const [clientMerchants, setClientMerchants] = useState<string[]>([]);
  const [allMerchants, setAllMerchants] = useState<Merchant[]>([]);
  const [loadingClientMerchants, setLoadingClientMerchants] = useState(false);
  const [loadingAllMerchants, setLoadingAllMerchants] = useState(false);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | undefined>(undefined);
  const [linkingMerchant, setLinkingMerchant] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !client) return;

    let mounted = true;

    const load = async () => {
      setError(null);
      setLoadingClientMerchants(true);
      setLoadingAllMerchants(true);

      try {
        const [clientIds, merchantsList] = await Promise.all([
          listClientMerchants(client.id),
          listAllMerchants(),
        ]);

        if (!mounted) return;

        setClientMerchants(clientIds ?? []);
        setAllMerchants(merchantsList ?? []);
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Ha ocurrido un error al cargar merchants'));
      } finally {
        if (mounted) {
          setLoadingClientMerchants(false);
          setLoadingAllMerchants(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
      setClientMerchants([]);
      setAllMerchants([]);
      setSelectedMerchantId(undefined);
      setError(null);
    };
  }, [open, client]);

  const handleLink = async () => {
    if (!client || !selectedMerchantId) return;

    setError(null);
    setLinkingMerchant(true);

    try {
      await linkClientToMerchant(client.id, selectedMerchantId);

      const refreshed = await listClientMerchants(client.id);
      setClientMerchants(refreshed);
      setSelectedMerchantId(undefined);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Ha ocurrido un error al asociar el merchant'));
    } finally {
      setLinkingMerchant(false);
    }
  };

  return (
    <Modal open={open} title={client ? `Merchants de ${client.name}` : 'Merchants del cliente'} onCancel={onClose} footer={null} destroyOnClose>
      {error && (
        <div style={{ marginBottom: 12 }}>
          <Alert type="error" message={error} />
        </div>
      )}

      {loadingClientMerchants ? (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <p>
            <strong>Merchants asociados:</strong>
          </p>
          {clientMerchants.length > 0 ? (
            <ul style={{ paddingLeft: 18, marginBottom: 16 }}>
              {clientMerchants.map((mId) => {
                const merchant = allMerchants.find((m) => m.id === mId);
                return <li key={mId}>{merchant ? merchant.name : mId}</li>;
              })}
            </ul>
          ) : (
            <p>No hay merchants asociados a este cliente.</p>
          )}

          <hr style={{ margin: '16px 0' }} />

          <p>
            <strong>Asociar nuevo merchant</strong>
          </p>

          {loadingAllMerchants ? (
            <Spin />
          ) : (
            <>
              <Select
                placeholder="Selecciona un merchant"
                value={selectedMerchantId}
                onChange={(value) => setSelectedMerchantId(value)}
                style={{ width: '100%', marginBottom: 8 }}
                options={allMerchants.map((m) => ({ value: m.id, label: m.name }))}
                showSearch
                optionFilterProp="label"
                allowClear
              />

              <Button type="primary" onClick={handleLink} loading={linkingMerchant} disabled={!selectedMerchantId} block>
                Asociar merchant
              </Button>
            </>
          )}
        </>
      )}
    </Modal>
  );
};

export default ClientMerchantsModal;
