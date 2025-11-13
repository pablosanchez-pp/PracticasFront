/**
 * @description: Esta función normaliza los datos enviados según un diccionario
 * @param {*} dictionary Diccionario de correlación con la key que se quiere normalizar
 * @param {*} responseBody  Objeto que contiene la respuesta del servicio que se quiere normalizar
 * @returns
 */
export const normalizeAsJson = (dictionary, responseBody) => {
  let newJson = {};

  Object.entries(responseBody).map(([key, value]) => {
    let jsonObject = {};

    if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
      const valueFromDictionary = dictionary[key](key, value, responseBody);
      jsonObject = valueFromDictionary;
    } else {
      jsonObject[key] = value;
    }

    newJson = { ...newJson, ...jsonObject };
  });

  return { ...responseBody, ...newJson };
};
