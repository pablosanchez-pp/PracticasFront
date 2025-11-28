export const MERCHANT_METHODS = {
  getMerchant: (response) => {
    console.log('METHOD getMerchants raw response', response);

    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  getMerchantByName: (response) => {
    console.log('METHOD getMerchantsByName raw response', response);

    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  createMerchant: (response) => {
    console.log('METHOD createMerchant raw response', response);
    return response.data ?? null;
  },

  updateMerchant: (response) => {
    console.log('METHOD updateMerchant raw response', response);
    return response.data ?? null;
  },

  deleteMerchant: (response) => {
    console.log('METHOD deleteMerchant raw response', response);

    if (response?.status === 200 || response?.status === 204) {
      return true;
    }
    return false;
  },

  getClientOfMerchant: (response) => {
    console.log('METHOD getClientOfMerchant raw response', response);

    const data = response?.data;
    if (!data) return null;

    if (typeof data === 'string') {
      return data; // clientId
    }

    if (typeof data === 'object' && data.id) {
      return data.id;
    }

    return null;
  },
};
