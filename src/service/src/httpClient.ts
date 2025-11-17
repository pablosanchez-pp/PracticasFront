export async function http<T>(
  url: string,
  options: RequestInit = {},
  JWT?: string,
): Promise<T> {
  console.log('FETCH a:', url);

  const method = (options.method ?? 'GET').toUpperCase();

  const baseHeaders = (options.headers ?? {}) as Record<string, string>;

  const headers: Record<string, string> = {
    ...baseHeaders,
  };

  
  if (method !== 'GET' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (JWT) {
    headers['Authorization'] = `Bearer ${JWT}`;
  }

  const res = await fetch(url, {
    ...options,
    method,
    headers,
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
