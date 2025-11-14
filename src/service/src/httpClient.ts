// src/service/src/httpClient.ts

export async function http<T>(
  url: string,
  options: RequestInit = {},
  JWT?: string,
): Promise<T> {
  console.log('FETCH a:', url);

  // método por defecto GET
  const method = (options.method ?? 'GET').toUpperCase();

  // Normalizamos los headers a un objeto simple { [clave]: string }
  const baseHeaders = (options.headers ?? {}) as Record<string, string>;

  const headers: Record<string, string> = {
    ...baseHeaders, // <- aquí el spread correcto
  };

  // Solo metemos Content-Type por defecto si NO es GET
  if (method !== 'GET' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Si hay JWT, añadimos Authorization
  if (JWT) {
    headers['Authorization'] = `Bearer ${JWT}`;
  }

  const res = await fetch(url, {
    ...options, // <- aquí también spread
    method,
    headers, // <- Record<string,string> es compatible con HeadersInit
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('RESPUESTA NO OK', res.status, text);
    throw new Error(`HTTP ${res.status} - ${text || res.statusText}`);
  }

  try {
    return (await res.json()) as T;
  } catch (e: any) {
    throw new Error(`No se ha podido parsear JSON: ${e?.message ?? e}`);
  }
}
