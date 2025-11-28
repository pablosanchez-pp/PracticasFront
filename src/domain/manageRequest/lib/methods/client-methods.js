export const CLIENT_METHODS = {
  getClient: (response) => {
    console.log('METHOD getClients raw response', response);

    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  getClientByName: (response) => {
    console.log('METHOD getClientsByName raw response', response);

    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  getClientById: (response) => {
    console.log('METHOD getClientById raw response', response);
    return response.data ?? null;
  },

  getClientByEmail: (response) => {
    console.log('METHOD getClientsByEmail raw response', response);

    const data = response.data;

    if (!data) return [];
    if (Array.isArray(data)) return data;

    return [data];
  },

  createClient: (response) => {
    console.log('METHOD createClient raw response', response);
    return response.data ?? null;
  },

  deleteClient: (response) => {
    console.log('METHOD deleteClient raw response', response);

    if (response?.status === 200 || response?.status === 204) {
      return true;
    }
    return false;
  },

  updateClient: (response) => {
    console.log('METHOD updateClient raw response', response);
    return response.data ?? null;
  },

  listMerchant: (response) => {
    console.log('METHOD listMerchants raw response', response);

    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  },

  link: (response) => {
    console.log('METHOD link raw response', response);

    if (response?.status === 204 || response?.status === 200) {
      return true;
    }
    return false;
  },
};