export const EXAMPLE_QUERIES = {
  getClients: () =>
    `http://localhost:8081/api/client/findAll`,

  getClientsByName: () =>
    `http://localhost:8081/api/client/findByName`,

  getClientsByEmail: () =>
    `http://localhost:8081/api/client/search/by-email`,

  createClient: () =>
    `http://localhost:8081/api/client`
};




export const EXAMPLE_ERROR_MESSAGES = {
    getClients:'No hay clientes',
    getClientsByName: 'No hay coincidencias con ese nombre',
    getClientsByEmail: 'No hay coincidencias con ese email'
}