export const EXAMPLE_QUERIES = {
  updateCommerce: (values) =>
    `https://localhost:3000/updateComerce/${values.id}`,
   getComerces: () =>
    `https://localhost:3000/getCommerces`,
  
  getClients: () =>
    `http://localhost:8081/api/client/findAll`,
};


export const EXAMPLE_ERROR_MESSAGES = {
  exampleQuery:'error',
  getComerces:'No hay comercios',
  getClients:'No hay clientes'
}