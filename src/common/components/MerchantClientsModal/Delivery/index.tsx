'use client';

import { useEffect, useState } from 'react';
import { Modal, Spin } from 'antd';
import type { Client } from '@/domain/client';
import { getErrorMessage } from '@/common/utils/errorHelpers';
import { getClientsOfMerchant, getClientById } from '@/common/components/MerchantClientsModal/Infraestructure/requests';
import type { MerchantClientsModalProps } from './interface';

const MerchantClientsModal: React.FC<MerchantClientsModalProps> = ({ open, merchant, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !merchant) return;

    let mounted = true;
    setError(null);
    setLoading(true);

    (async () => {
      try {
        const result = await getClientsOfMerchant(merchant.id);

        if (!mounted) return;

        let clientIds: string[] = [];

        if (Array.isArray(result)) clientIds = result as string[];
        else if (result == null) clientIds = [];
        else if (typeof result === 'string') {
          setError(result as string);
          setClients([]);
          return;
        }

        if (!clientIds.length) {
          setClients([]);
          return;
        }

        const settled = await Promise.allSettled(clientIds.map((id) => getClientById(id)));
        if (!mounted) return;

        const resolved: Client[] = settled
          .filter((r) => r.status === 'fulfilled')
          .map((r) => (r as PromiseFulfilledResult<Client | null>).value as Client | null)
          .filter((c): c is Client => c !== null && c !== undefined);

        setClients(resolved);
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Error cargando clientes asociados'));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      setClients([]);
      setError(null);
      setLoading(false);
    };
  }, [open, merchant]);

  return (
    <Modal open={open} title={merchant ? `Clientes asociados - ${merchant.name}` : 'Clientes asociados'} onCancel={onClose} footer={null} destroyOnClose>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <Spin />
        </div>
      ) : error ? (
        <div style={{ padding: 8 }}>{error}</div>
      ) : (
        <div>
          {clients.length ? (
            <div>
              {clients.map((c) => (
                <p key={c.id}>
                  {c.name} {c.surname} ({c.email})
                </p>
              ))}
            </div>
          ) : (
            <p>Este merchant no tiene clientes asociados</p>
          )}
        </div>
      )}
    </Modal>
  );
};

export default MerchantClientsModal;
