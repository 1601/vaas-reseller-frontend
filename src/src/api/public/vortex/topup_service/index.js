import { v4 as uuidv4 } from 'uuid';
import SecureLS from "secure-ls"
import { API } from "../../../api-config"


/**
 * 
 * @param {*} access_token 
 * @param {*} docId - This is the mongodb ID
 * @param {*} clientRequestId 
 * @param {*} mobileNumber 
 * @param {*} productCode 
 * @param {*} paymentId 
 * @param {*} totalAmount 
 * @param {*} oneAedToPhp
 * @param {*} convenienceFee 
 * @param {*} callbackUrl 
 * @returns Vortex transaction result
 */
export const createVortexTopupTransaction = async ({ 
  // eslint-disable-next-line camelcase
  access_token, docId, clientRequestId, mobileNumber, productCode, paymentId, totalAmount, oneAedToPhp, convenienceFee, currencySymbol, currencyToPhp, callbackUrl }) => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")
  const userId = ls.get("userId")
  const store = ls.get("store")

  const uniqueId = uuidv4()

  const reqBody = {
    "docId": docId,
    "clientRequestId": `${clientRequestId}${uniqueId}`,
    "mobileNumber": `${mobileNumber.trim()}`,
    "productCode": `${productCode.trim()}`,
    "userId": userId,
    "paymentId": paymentId,
    "totalAmount": totalAmount,
    "store": store?._id,
    "oneAedToPhp": oneAedToPhp,
    "convenienceFee": convenienceFee,
    "currencySymbol": currencySymbol,
    "currencyToPhp": currencyToPhp
  }

  return fetch(`${API}/vortex/topup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      // eslint-disable-next-line camelcase
      "access_token": `${access_token}`
    },
    body: JSON.stringify(reqBody)
  })
    .then(response => response)
    .catch(err => err);
};

export const getTransactionByRefNumber = async (
  // eslint-disable-next-line camelcase
  access_token, refNumber) => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")

  return fetch(`${API}/vortex/topup/${refNumber}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      // eslint-disable-next-line camelcase
      "access_token": `${access_token}`
    },
  })
    .then((response) => {
      return response
    })
    .catch((err) => {

      return err
    })
}

export const getTransactionByClientRequestId = async (
  // eslint-disable-next-line camelcase
  access_token, clientRequestId) => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")

  return fetch(`${API}/vortex/topup/clientRequestId/${clientRequestId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response
    })
    .catch((err) => {

      return err
    })
}
