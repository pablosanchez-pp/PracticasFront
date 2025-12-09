import React, { Suspense } from 'react';
import { Spin } from 'antd';
import MerchantsPageServer from '@/common/pages/merchantPageServer';

export default async function MerchantPage({ searchParams }: { searchParams?: Record<string, unknown> }) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Spin tip="Cargando clientes..." />
        </div>
      }
    >
      {/* Server wrapper: will fetch initialClients and pass server actions */}
      <MerchantsPageServer searchParams={searchParams} />
    </Suspense>
  );
}
