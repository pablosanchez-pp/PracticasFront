import clientUseCases from './lib/clients'
import merchantUseCases from './lib/merchants'

const queries = {
  ...clientUseCases,
  ...merchantUseCases,
};

export default queries;
