import queries from "./queries/index";

/**
 * @description Capa application, donde se gestiona los distintos casos de uso de la aplicacion, pidiendo datos a distintas APIs
 */
const useCases = {
  ...queries,
};

export default useCases;
