import manageRequest from '@/domain/manageRequest';

const userUseCases = {
  getUser: (signal, values, token) =>
    manageRequest(
      signal,
      'getUser',
      values,
      'normal',
      'normal',
      'get',
      token,
      undefined,
    ),

  createUser: (signal, values, token) =>
    manageRequest(
      signal,
      'createUser',
      values,
      'normal',
      'normal',
      'post',
      token,
      undefined,
      { 'Content-Type': 'application/json' },
    ),

  loginUser: (signal, values, token) =>
    manageRequest(
      signal,
      'loginUser',
      values,
      'normal',
      'normal',
      'post',
      token,
      undefined,
      { 'Content-Type': 'application/json' },
    ),

  logoutUser: (signal, values, token) =>
    manageRequest(
      signal,
      'logoutUser',
      values,
      'url',
      'normal',
      'post',
      token,
      undefined,
    ),
};

export default userUseCases;
