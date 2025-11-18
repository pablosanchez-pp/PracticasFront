import manageRequest from '@/domain/manageRequest';

const clientUseCases = {
  getClients: (signal, values, token) => {
    return manageRequest(
      signal,
      'getClients',
      values,
      'query',
      'normal',
      'get',
      token,
      undefined,
    );
  },

  getClientsByName: (signal, values, token) => {
    return manageRequest(
      signal,
      'getClientsByName', 
      values,
      'query', 
      'normal',
      'get',
      token,
      undefined,
    );
  },

  getClientsByEmail: (signal, values, token) => {
    return manageRequest(
      signal,
      'getClientsByEmail', 
      values,
      'query', 
      'normal',
      'get',
      token,
      undefined,
    );
  },
};

export default clientUseCases;
