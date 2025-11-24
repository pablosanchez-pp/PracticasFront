import manageRequest from '@/domain/manageRequest';

const clientUseCases = {
  getClients: (signal, values, token) =>
    manageRequest(
      signal,
      'getClients',
      values,
      'query',
      'normal',
      'get',
      token,
      undefined,
    ),

  getClientsByName: (signal, values, token) =>
    manageRequest(
      signal,
      'getClientsByName',
      values,
      'query',
      'normal',
      'get',
      token,
      undefined,
    ),

  getClientsByEmail: (signal, values, token) =>
    manageRequest(
      signal,
      'getClientsByEmail',
      values,
      'query',
      'normal',
      'get',
      token,
      undefined,
    ),

  getClientById: (signal, values, token) =>
    manageRequest(
      signal,
      'getClientById',
      values,
      'normal', 
      'normal',
      'get',
      token,
      undefined,
    ),  

  createClient: (signal, values, token) =>
    manageRequest(
      signal,
      'createClient',       
      values,                     
      'normal',             
      'normal',               
      'post',                     
      token,
      undefined,                  
      { 'Content-Type': 'application/json' }, 
    ),

   deleteClient: (signal, values, token) =>
    manageRequest(
      signal,
      'deleteClient',       
      values,                     
      'normal',             
      'normal',               
      'post',                     
      token,
      undefined,                  
    ), 

  updateClient: (signal, values, token) =>
    manageRequest(
      signal,
      'updateClient',        
      values,                  
      'normal',
      'normal',
      'put',        
      token,
      undefined,
      { 'Content-Type': 'application/json' },
    ),

  listMerchants: (signal, values, token) =>
    manageRequest(
      signal,
      'listMerchants',   
      values,        
      'normal',
      'normal',
      'get',
      token,
      undefined,
    ),


  link: (signal, values, token) =>
    manageRequest(
      signal,
      'link',       
      values,         
      'normal',
      'normal',
      'post',
      token,
      undefined,
    ),

  getClientOfMerchant: (signal, values, token) =>
    manageRequest(
      signal,
      'getClientOfMerchant',
      values,
      'normal',
      'normal',
      'get',
      token,
      undefined,
    ),
};

export default clientUseCases;
