export async function http<T>(
  url: string,
  options: RequestInit,
  jwt?: string,
): Promise<T> {
  const config: RequestInit = {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
  };

  const response = await fetch(url, config);


  if (!response.ok) {
    let errorBody: any = null;
    try {
      errorBody = await response.json();
    } catch {
      
    }

    const error: any = new Error(response.statusText || 'HTTP error');
    error.status = response.status;
    error.body = errorBody;
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    return text as T;
  }

  try {
    const data = await response.json();
    return data as T;
  } catch (e) {
    console.error(e);
    throw new Error('No se ha podido parsear JSON: ' + (e as Error).message);
  }
}
