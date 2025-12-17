import Service from '@/service/src';
import { getErrorMessage } from '@/common/utils/errorHelpers';

interface LoginValues {
  username: string;
  password: string;
}

interface RegisterValues {
  username: string;
  password: string;
}

export async function loginUser(values: LoginValues, signal?: AbortSignal) {
  try {
    const res = await Service.getCases('loginUser', {
      signal,
      endPointData: values,
      token: undefined,
    });
    return res;
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err, 'Error en login'));
  }
}

export async function registerUser(values: RegisterValues, signal?: AbortSignal) {
  try {
    const res = await Service.getCases('createUser', {
      signal,
      endPointData: values,
      token: undefined,
    });
    return res;
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err, 'Error registrando usuario'));
  }
}

export async function logoutUser(id: string, signal?: AbortSignal) {
  try {
    // Let manageRequest resolve the per-user token (from sessionStorage or cookie)
    const res = await Service.getCases('logoutUser', {
      signal,
      endPointData: { id },
      token: undefined,
    });

    // Also clear server-side httpOnly cookie (best-effort)
    try {
      fetch('/api/auth/clear-token', { method: 'POST' }).catch(() => {});
    } catch {}

    return res;
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err, 'Error cerrando sesión'));
  }
}

export default { loginUser, registerUser, logoutUser };
