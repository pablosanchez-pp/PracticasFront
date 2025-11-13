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
    let fetchConfig = {
      signal,
      method,
      cache,
      headers: token
        ? {
            Authorization: token,
            Tokenid: token,
            ...headers,
          }
        : { ...headers },
    };

    let url = QUERIES[requestString](params);
    if (mode === 'query') {
      if (typeof params === 'string') {
        url += `?${params}`;
      } else {
        const dataForSend = Object.keys(params)
          .map(
            (k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]),
          )
          .join('&');
        url += `?${dataForSend}`;
      }
    } else if (mode === 'url') {
      url += Object.values(params).map((v) => '/' + encodeURIComponent(v));
    } else if (
      METHODS_WITH_BODY.includes(method.toLowerCase()) ||
      mode === 'body'
    ) {
      fetchConfig['body'] = commonBody ? JSON.stringify(params) : params;
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
        body: responseBody && responseType === 'string'
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

    const responseData = responseType === 'string' ? responseBody : JSON.parse(responseBody);

    return METHODS[requestString](
      { data: responseData, config: { url, ...fetchConfig } },
      requestString,
    );
  } catch (error) {
    console.error('[FETCH_CONFIG_ERROR]', error);
    throw error;
  }
};

export default manageRequest;
