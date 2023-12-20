import { instanceOf } from "prop-types";

export default function trimObjValues(obj) {
  return Object.keys(obj).reduce((acc, curr) => {

    // console.log(`${obj[curr]} is ${typeof obj[curr] === 'string' ? "String" : "Number"}`)
    // acc[curr] = typeof obj[curr] === 'string' ? obj[curr].trim() : obj[curr]

    acc[curr] = String(obj[curr]).trim().replace('-', '')
    return acc;
  }, {});
}