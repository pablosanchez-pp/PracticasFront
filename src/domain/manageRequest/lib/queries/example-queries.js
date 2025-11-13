export const EXAMPLE_QUERIES = {
  updateCommerce: (values) =>
    `https://localhost:3000/updateComerce/${values.id}`,
   getComerces: () =>
    `https://localhost:3000/getCommerces`,
  
  
};


export const EXAMPLE_ERROR_MESSAGES = {
  exampleQuery:'error',
  getComerces:'No hay comercios'
}