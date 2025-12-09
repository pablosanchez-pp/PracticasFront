/* Utility JSON types without using `any` */
declare namespace Utility {
    type JSONPrimitive = string | number | boolean | null;
    /** Objects with unknown-ish values (keeps callers flexible for non-JSON runtime values) */
    type JSONObject = { [key: string]: unknown };
    type JSONArray = JSONValue[];
    type JSONValue = JSONPrimitive | JSONObject | JSONArray;
}