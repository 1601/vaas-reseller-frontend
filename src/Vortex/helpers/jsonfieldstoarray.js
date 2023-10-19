/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
export default function jsonFieldsToArray(jsonObject) {
  const jsonFields = []

  for (const field in jsonObject) {
    jsonFields.push([field, jsonObject[field]])
  }

  return jsonFields
}
