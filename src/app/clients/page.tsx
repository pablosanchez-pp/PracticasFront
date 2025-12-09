import React, { Suspense } from 'react';
import { Spin } from 'antd';
import ClientsPageServer from '@/common/pages/clientPageServer';

export default async function ClientsPage({ searchParams }: { searchParams?: Record<string, unknown> }) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Spin tip="Cargando clientes..." />
        </div>
      }
    >
      {/* Server wrapper: will fetch initialClients and pass server actions */}
      <ClientsPageServer searchParams={searchParams} />
    </Suspense>
  );
}
