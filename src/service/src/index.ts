import useCases from './application';

const useCasesJson = useCases as Utility.JSONValue;

/**
 * @description Capa de Service, donde se sirven distintas funcionalidades que pueden no estar relacionadas con la capa de application
 */

const Service = {
  /**
   * @description Esta función ejecuta los useCases de la aplicación
   * @param useCaseName   - nombre del useCase
   * @param parameters  - parámetros del useCase
   * @returns
   */
  getCases: (useCaseName: string, parameters: Utility.JSONValue) =>
    new Promise((resolve, reject) => {
      try {
        const { signal, endPointData, token } = parameters;
        useCasesJson[useCaseName](signal, endPointData, token)
          .then((response: unknown) => resolve(response))
          .catch((error: unknown) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    }),
};

export default Service;
