

export const getCommercesDictionary = {
  id: (key, value, responseBody) => {
    const response = { key: responseBody.id, id: value };
    delete responseBody[key];
    return response;
  },
  
};
