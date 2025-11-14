import manageRequest from '@/domain/manageRequest';

const exampleUseCases = {
  getComerces: (signal, values, token) => {
    
    return manageRequest(
      signal,
      'getComerces',
      values,
      'query',
      'normal',
      'get',
      token,
      undefined,
    );
  },

  postComerces: (signal, values, token) => {
    
    return manageRequest(
      signal,
      'updateCommerce',
      values,
      'query',
      'normal',
      'put',
      token,
      undefined,
    );
  },

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
  }
};

export default exampleUseCases;
