import Service from '@/service/src';
import type { Client } from '@/domain/client';

const JWT = process.env.NEXT_PUBLIC_JWT;

export async function getClientsOfMerchant(merchantId: string): Promise<string[] | string | null> {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const res = await Service.getCases('getClientOfMerchant', {
      signal,
      endPointData: { merchantId },
      token: JWT,
    });

    if (res == null) return null;
    if (typeof res === 'string') return res as string;
    if (Array.isArray(res)) return res as string[];
    return null;
  } catch (err: unknown) {
    
    if (err instanceof Error) {
      const msg = err.message;
      
        const quoted = msg.match(/"([^"]+)"/);
        if (quoted && quoted[1] && quoted[1].length > 20) return quoted[1];
        if (/Unexpected token|not valid JSON/i.test(msg)) {
          return 'Este merchant no tiene clientes asociados';
      }
      
      return msg;
    }
    return 'Error desconocido al obtener clientes asociados';
  }
}

export async function getClientById(id: string): Promise<Client | null> {
  const controller = new AbortController();
  const signal = controller.signal;

  const res = await Service.getCases('getClientById', {
    signal,
    endPointData: { id },
    token: JWT,
  });

  return (res as Client) ?? null;
}

export default { getClientsOfMerchant, getClientById };
