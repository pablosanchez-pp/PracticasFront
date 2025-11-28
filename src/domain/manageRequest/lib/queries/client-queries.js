export const CLIENT_QUERIES = {
  getClient: () =>
    `http://localhost:8081/api/client/findAll`,//ok

  getClientById: () =>
    `http://localhost:8081/api/client/{id}`,

  getClientByName: () =>
    `http://localhost:8081/api/client/findByName`,//ok

  getClientByEmail: () =>
    `http://localhost:8081/api/client/search/by-email`,//ok

  createClient: () =>
    `http://localhost:8081/api/client`,//ok
 
  deleteClient: () =>
    `http://localhost:8081/api/client`,//ok

  updateClient: () =>
    `http://localhost:8081/api/client`, //ok

  link: () =>
    `http://localhost:8081/api/client/{clientId}/merchants/{merchantId}`,

  listMerchant: () =>
    `http://localhost:8081/api/client/{clientId}/merchants`,
};

export const CLIENT_ERROR_MESSAGES = {
  getClient: 'No hay clientes',
  getClientByName: 'No hay coincidencias con ese nombre',
  getClientByEmail: 'No hay coincidencias con ese email',
  getClientById: 'Cliente no encontrado',
  createClient: 'No se ha podido crear el cliente',
  updateClient: 'No se ha podido actualizar el cliente',
  deleteClient: 'No se ha podido eliminar el cliente',
  listMerchant: 'Este cliente no tiene merchants asociados',
  link: 'No se ha podido vincular el cliente con el merchant',
};