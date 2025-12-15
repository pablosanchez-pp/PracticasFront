export const USER_QUERIES = {
  getUser: () => `http://localhost:8083/api/auth/usuarios`,

  createUser: () => `http://localhost:8083/api/auth/register`,

  loginUser: () => `http://localhost:8083/api/auth/login`,

  logoutUser: () => `http://localhost:8083/api/auth/logout/{id}`,
};

export const USER_ERROR_MESSAGES = {
  getUser: 'No hay usuarios',
  createUser: 'No se ha podido crear el usuario',
  loginUser: 'Credenciales inválidas',
  logoutUser: 'No se ha podido cerrar sesión del usuario',
};
