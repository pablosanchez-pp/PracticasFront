export const MERCHANT_QUERIES = {
  getMerchant: () =>
    `http://localhost:8082/api/merchant/findAll`,

  getMerchantById: () =>
    `http://localhost:8082/api/merchant/{id}`,

  getMerchantByName: () =>
    `http://localhost:8082/api/merchant/nombre/{nombre}`,

  createMerchant: () =>
    `http://localhost:8082/api/merchant`,

  updateMerchant: () =>
    `http://localhost:8082/api/merchant`,

  deleteMerchant: () =>
    `http://localhost:8082/api/merchant`,

  getClientOfMerchant: () =>
    `http://localhost:8082/api/merchant/{merchantId}/client`,
};

export const MERCHANT_ERROR_MESSAGES = {
  getMerchant: 'No hay merchants',
  getMerchantByName: 'No hay coincidencias con ese nombre',
  createMerchant: 'No se ha podido crear el merchant',
  updateMerchant: 'No se ha podido actualizar el merchant',
  deleteMerchant: 'No se ha podido eliminar el merchant',
  getClientOfMerchant: 'Este merchant no tiene cliente asociado',
};
