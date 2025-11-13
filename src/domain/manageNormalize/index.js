import Dictionary from './dictionary';
import { normalizeAsJson } from './utils/normalizeUtils';

export const normalize = (data, dictionaryName = null) => {
  const dictionary = dictionaryName ? Dictionary[dictionaryName] : null;
  const isArray = Array.isArray(data);

  let normalizeJSON = dictionary
    ? isArray
      ? data.map((data) => normalizeAsJson(dictionary, data))
      : normalizeAsJson(dictionary, data)
    : data;

  if (isArray && !normalizeJSON[0]?.key) {
    normalizeJSON = normalizeJSON.map((item) => ({
      ...item,
      key: crypto.randomUUID(),
    }));
  }

  return isArray ? normalizeJSON : { ...normalizeJSON };
};
