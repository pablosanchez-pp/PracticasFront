export const EXAMPLE_QUERIES = {
  getClients: () =>
    `http://localhost:8081/api/client/findAll`,

  getClientsByName: () =>
    `http://localhost:8081/api/client/findByName`,

  getClientsByEmail: () =>
    `http://localhost:8081/api/client/search/by-email`,

  createClient: () =>
    `http://localhost:8081/api/client`,

  deleteClient: () =>
    `http://localhost:8081/api/client`,

  updateClient: () =>
    `http://localhost:8081/api/client`,

  getMerchants: () =>
    `http://localhost:8082/api/merchant/findAll`,

  getMerchantsByName: () =>
    `http://localhost:8082/api/merchant/nombre`,

  createMerchant: () =>
    `http://localhost:8082/api/merchant`,

  updateMerchant: () =>
    `http://localhost:8082/api/merchant`,

  deleteMerchant: () =>
    `http://localhost:8082/api/merchant`,

  link: () =>
    `http://localhost:8081/api/client/{clientId}/merchants/{merchantId}`,

  listMerchants: () =>
    `http://localhost:8081/api/client/{clientId}/merchants`
};


export const EXAMPLE_ERROR_MESSAGES = {
    getClients:'No hay clientes',
    getClientsByName: 'No hay coincidencias con ese nombre',
    getClientsByEmail: 'No hay coincidencias con ese email',
    getMerchants: 'No hay merchants',
    getMerchantsByName: 'No hay coincidencias con ese nombre',
}