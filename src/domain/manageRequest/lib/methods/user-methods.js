export const USER_METHODS = {
  getUser: (response) => {
    console.log('METHOD getUsers raw response', response);

    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  createUser: (response) => {
    console.log('METHOD createUser raw response', response);
    return response.data ?? null;
  },

  loginUser: (response) => {
    console.log('METHOD loginUser raw response', response);
    return response.data ?? null;
  },

  logoutUser: (response) => {
    console.log('METHOD logoutUser raw response', response);
    if (response?.status === 200 || response?.status === 204) {
      return true;
    }
    return false;
  },
};
