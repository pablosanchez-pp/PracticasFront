/********************************************************************************************
 * Librería de todos los errores, queries y métodos de gestión de datos de las llamadas a API
 * *****************************************************************************************/

import { CLIENT_METHODS} from "./methods/client-methods";
import { MERCHANT_METHODS } from "./methods/merchant-methods";
import { USER_METHODS } from "./methods/user-methods";
import {CLIENT_ERROR_MESSAGES, CLIENT_QUERIES} from "./queries/client-queries";
import {MERCHANT_ERROR_MESSAGES, MERCHANT_QUERIES} from "./queries/merchant-queries";
import {USER_ERROR_MESSAGES, USER_QUERIES} from "./queries/user-queries";


export const METHODS = { 
  ...CLIENT_METHODS,
  ...MERCHANT_METHODS,
  ...USER_METHODS,
};

export const QUERIES = {
  ...CLIENT_QUERIES,
  ...MERCHANT_QUERIES,
  ...USER_QUERIES,
};

export const ERROR_MESSAGES = {
  ...CLIENT_ERROR_MESSAGES,
  ...MERCHANT_ERROR_MESSAGES,
  ...USER_ERROR_MESSAGES,
};
