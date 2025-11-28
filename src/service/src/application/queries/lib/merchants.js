import manageRequest from '@/domain/manageRequest';

const merchantUseCases = {
  getMerchant: (signal, values, token) =>
    manageRequest(
      signal,
      'getMerchant',  
      values,          
      'normal',
      'normal',
      'get',
      token,
      undefined,
    ),

  getMerchantById: (signal, values, token) =>
    manageRequest(
      signal,
      'getMerchantById', 
      values,
      'url',
      'normal',
      'get',
      token,
      undefined,
    ),

  getMerchantByName: (signal, values, token) =>
    manageRequest(
      signal,
      'getMerchantByName', 
      values,
      'url',
      'normal',
      'get',
      token,
      undefined,
    ),

  createMerchant: (signal, values, token) =>
    manageRequest(
      signal,
      'createMerchant', 
      values,
      'normal',
      'normal',
      'post',
      token,
      undefined,
      { 'Content-Type': 'application/json' },
    ),


  updateMerchant: (signal, values, token) =>
    manageRequest(
      signal,
      'updateMerchant', 
      values,
      'url',
      'normal',
      'put',
      token,
      undefined,
      { 'Content-Type': 'application/json' },
    ),

  deleteMerchant: (signal, values, token) =>
    manageRequest(
      signal,
      'deleteMerchant', 
      values,
      'url',
      'normal',
      'delete',
      token,
      undefined,
    ),

  getClientOfMerchant: (signal, values, token) =>
    manageRequest(
      signal,
      'getClientOfMerchant',
      values,
      'url',
      'normal',
      'get',
      token,
      undefined,
    ),
};

export default merchantUseCases;
