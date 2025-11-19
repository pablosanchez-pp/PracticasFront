export const EXAMPLE_METHODS = {
  getClients: (response) => {
    console.log('METHOD getClients raw response', response);

    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  getClientsByName: (response) => {
    console.log('METHOD getClientsByName raw response', response);

    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];

  },

  getClientsByEmail: (response) => {
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
};
