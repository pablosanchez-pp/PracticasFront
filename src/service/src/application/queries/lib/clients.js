import manageRequest from '@/domain/manageRequest';

const clientUseCases = {
  getClient: (signal, values, token) =>
    manageRequest(
      signal,
      'getClient',
      values,
      'query',
      'normal',
      'get',
      token,
      undefined,
    ),

  getClientByName: (signal, values, token) =>
    manageRequest(
      signal,
      'getClientByName',
      values,
      'query',
      'normal',
      'get',
      token,
      undefined,
    ),

  getClientByEmail: (signal, values, token) =>
    manageRequest(
      signal,
      'getClientByEmail',
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
      'url',
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
      'url',             
      'normal',               
      'delete',                     
      token,
      undefined,                  
    ), 

  updateClient: (signal, values, token) =>
    manageRequest(
      signal,
      'updateClient',        
      values,                  
      'url',
      'normal',
      'put',        
      token,
      undefined,
      { 'Content-Type': 'application/json' },
    ),

  listMerchant: (signal, values, token) =>
    manageRequest(
      signal,
      'listMerchant',   
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
      'url',
      'normal',
      'post',
      token,
      undefined,
    ),
};

export default clientUseCases;
