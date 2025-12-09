export function isAbortError(err: unknown): boolean {
  if (typeof err === 'object' && err !== null && 'name' in err) {
    try {
      return (err as { name?: unknown }).name === 'AbortError';
    } catch {
      return false;
    }
  }

  return false;
}

export function getErrorStatus(err: unknown): number | undefined {
  if (typeof err === 'object' && err !== null) {
    const obj = err as Record<string, unknown>;
    if (typeof obj.status === 'number') return obj.status;
    const body = obj.body;
    if (typeof body === 'object' && body !== null) {
      const b = body as Record<string, unknown>;
      if (typeof b.status === 'number') return b.status;
    }
  }
  return undefined;
}

export function getErrorMessage(err: unknown, fallback = 'Ha ocurrido un error'): string {
  if (err instanceof Error) return err.message;

  if (typeof err === 'object' && err !== null) {
    const obj = err as Record<string, unknown>;

    const body = obj.body;
    if (typeof body === 'object' && body !== null) {
      const b = body as Record<string, unknown>;
      if (typeof b.message === 'string') return b.message;
      if (typeof b.error === 'string') return b.error;
    }

    if (typeof obj.statusText === 'string') return obj.statusText;
    if (typeof obj.message === 'string') return obj.message;
  }

  try {
    if (err === null || err === undefined) return fallback;
    return String(err);
  } catch {
    return fallback;
  }
}
