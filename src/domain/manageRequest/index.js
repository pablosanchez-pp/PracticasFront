import { METHODS, QUERIES } from './lib/index';

const METHODS_WITH_BODY = ['put', 'post', 'patch'];

/**
 * Gestor que maneja con ayuda de una librería de queries y de methods toda la gestión de pedir datos
 * a una fapp, tratar dichos datos y la gestión de los posibles errores.
 *
 * @param {AbortSignal} signal Permite abortar y no esperar a una respuesta si el usuario abandona la página donde se realizaba la petición
 * @param {string} requestString Nombre de la función a usar
 * @param {Object | string} params with defaults {}. Parámetros que necesita la llamada de la petición
 * @param {string} mode with defaults "normal". Gestiona cómo se insertarán los filtros en la petición
 * @param {string} responseType with defaults "normal". Gestiona el tipo de respuesta que queremos que nos dé axios
 * @param {string} method with defaults "get". Nos dice el método que se usará para la petición
 * @param {string} token Token
 * @param {string} cache with defaults "no-cache". Gestiona el tipo de caché que queremos utilizar
 * @param {Object} headers with defaults {}. Encabezados adicionales para la petición
 * @param {boolean} commonBody with defaults true. Gestiona la manera de añadir los params al body en las peticiones
 * @returns {Promise} Respuesta de varios tipos, normalmente [JSON] o JSON, Buffer, etc.
 */
const manageRequest = async (
  signal,
  requestString,
  params = {},
  mode = 'normal',
  responseType = 'normal',
  method = 'get',
  token,
  cache = 'no-store',
  headers = {},
  commonBody = true,
) => {
  try {
    // Resolve token: prefer explicit parameter, otherwise try to read from browser storage/cookie
    let resolvedToken = token;
    try {
      if (!resolvedToken && typeof window !== 'undefined') {
        const sess = sessionStorage.getItem('TOKEN');
        if (sess) resolvedToken = sess;
        else {
          const m = document.cookie.match(/(?:^|; )token=([^;]+)/);
          if (m && m[1]) resolvedToken = decodeURIComponent(m[1]);
        }
      }

      // If the resolved token matches a legacy/global build-time token or a known dummy
      // value, clear it from storage so we don't keep using the old hardcoded token.
      try {
        const legacy = typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_JWT : undefined;
        if (resolvedToken && (resolvedToken === legacy || String(resolvedToken).includes('DummySignature'))) {
          try { sessionStorage.removeItem('TOKEN'); } catch (e) {}
          try { document.cookie = 'token=; path=/; max-age=0'; } catch (e) {}
          resolvedToken = undefined;
        }
      } catch (e) {}
    } catch (e) {
      // ignore
    }

    const authHeader = resolvedToken
      ? resolvedToken.startsWith('Bearer ')
        ? resolvedToken
        : `Bearer ${resolvedToken}`
      : undefined;

    // DEBUG: show which token was resolved for this request (development only)
    try {
      // mask token a bit to avoid huge logs, but show full for troubleshooting if needed
      const masked = resolvedToken
        ? `${String(resolvedToken).slice(0, 12)}...${String(resolvedToken).slice(-8)}`
        : null;
      // eslint-disable-next-line no-console
      console.debug('[manageRequest] request=', requestString, 'resolvedToken=', masked);
    } catch (e) {}

    let fetchConfig = {
      signal,
      method,
      cache,
      credentials: 'same-origin',
      headers: authHeader
        ? {
            Authorization: authHeader,
            ...headers,
          }
        : { ...headers },
    };

    let url = QUERIES[requestString](params);

    let bodyParams = params && typeof params === 'object' ? { ...params } : params;

    if (typeof url === 'string' && params && typeof params === 'object') {
      url = url.replace(/\{([^}]+)\}/g, (match, key) => {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          const v = params[key];
          if (bodyParams && typeof bodyParams === 'object') delete bodyParams[key];
          return encodeURIComponent(v);
        }
        return match;
      });
    }

    if (mode === 'query') {
      if (typeof params === 'string') {
        url += `?${params}`;
        bodyParams = {};
      } else {
        const dataForSend = Object.keys(params)
          .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
          .join('&');
        url += `?${dataForSend}`;
        bodyParams = {};
      }
    } else if (mode === 'url') {
      if (typeof params === 'string') {
        url += '/' + encodeURIComponent(params);
        bodyParams = {};
      } else if (Array.isArray(params)) {
        url += params.map((v) => '/' + encodeURIComponent(v)).join('');
        bodyParams = {};
      } else if (params && typeof params === 'object') {
        const keys = bodyParams && typeof bodyParams === 'object' ? Object.keys(bodyParams) : Object.keys(params);
        const idKeys = keys.filter((k) => /id$/i.test(k));
        if (METHODS_WITH_BODY.includes(method.toLowerCase()) && idKeys.length > 0) {
          url += idKeys.map((k) => '/' + encodeURIComponent(bodyParams[k] ?? params[k])).join('');
          idKeys.forEach((k) => delete bodyParams[k]);
        } else if (keys.length > 0) {
          url += keys.map((k) => '/' + encodeURIComponent(bodyParams[k] ?? params[k])).join('');
          bodyParams = {};
        } else {
       
        }
      }
    }

    if (METHODS_WITH_BODY.includes(method.toLowerCase()) || mode === 'body') {
      fetchConfig['body'] = commonBody ? JSON.stringify(bodyParams) : bodyParams;
    }

    const response = await fetch(url, fetchConfig);
    const responseBody = await response.text();

    if (!response.ok) {
      console.error('[FETCH_ERROR]', response);
      throw {
        params,
        query: requestString,
        status: response.status,
        statusText: response.statusText,
        body:
          responseBody && responseType === 'string'
            ? responseBody
            : JSON.parse(responseBody),
      };
    }

    if (response.status === 204 || !responseBody) {
      return METHODS[requestString](
        { data: null, config: { url, ...fetchConfig } },
        requestString,
      );
    }

    const responseData =
      responseType === 'string' ? responseBody : JSON.parse(responseBody);

    return METHODS[requestString](
      { data: responseData, config: { url, ...fetchConfig } },
      requestString,
    );
  } catch (error) {
  
    if (error && error.name === 'AbortError') {
      throw error;
    }

    console.error('[FETCH_CONFIG_ERROR]', error);
    throw error;
  }
};

export default manageRequest;
