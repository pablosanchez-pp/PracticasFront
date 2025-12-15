import clientUseCases from './lib/clients'
import merchantUseCases from './lib/merchants'
import userUseCases from './lib/users'

const queries = {
  ...clientUseCases,
  ...merchantUseCases,
  ...userUseCases,
};

export default queries;
