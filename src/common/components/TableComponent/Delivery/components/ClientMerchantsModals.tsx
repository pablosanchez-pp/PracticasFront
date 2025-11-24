'use client';

import { Modal, Spin, Select, Button } from 'antd';
import type { Client } from '@/domain/client';
import type { Merchant } from '@/domain/merchant';

interface ClientMerchantsModalProps {
  open: boolean;
  client: Client | null;
  clientMerchants: string[];
  allMerchants: Merchant[];
  loadingClientMerchants: boolean;
  loadingAllMerchants: boolean;
  selectedMerchantId?: string;
  onChangeSelectedMerchant: (value?: string) => void;
  onClose: () => void;
  onLinkMerchant: () => void;
  linkingMerchant: boolean;
}

const ClientMerchantsModal: React.FC<ClientMerchantsModalProps> = ({
  open,
  client,
  clientMerchants,
  allMerchants,
  loadingClientMerchants,
  loadingAllMerchants,
  selectedMerchantId,
  onChangeSelectedMerchant,
  onClose,
  onLinkMerchant,
  linkingMerchant,
}) => {
  return (
    <Modal
      open={open}
      title={client ? `Merchants de ${client.name}` : 'Merchants del cliente'}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {loadingClientMerchants ? (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <Spin tip="Cargando merchants del cliente..." />
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
            <Spin tip="Cargando lista de merchants..." />
          ) : (
            <>
              <Select
                placeholder="Selecciona un merchant"
                value={selectedMerchantId}
                onChange={(value) => onChangeSelectedMerchant(value)}
                style={{ width: '100%', marginBottom: 8 }}
                options={allMerchants.map((m) => ({
                  value: m.id,
                  label: m.name,
                }))}
                showSearch
                optionFilterProp="label"
                allowClear
              />

              <Button
                type="primary"
                onClick={onLinkMerchant}
                loading={linkingMerchant}
                disabled={!selectedMerchantId}
                block
              >
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
