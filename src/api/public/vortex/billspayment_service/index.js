/* eslint-disable camelcase */
/* eslint-disable no-return-await */
import SecureLS from "secure-ls"
import { v4 as uuidv4 } from 'uuid';
import { API } from "../../../api-config"
/**
 * 
 * @param {*} access_token 
 * @param {*} docId - This is the mongodb ID
 * @param {*} clientRequestId 
 * @param {*} billerId 
 * @param {*} billDetails 
 * @param {*} paymentId 
 * @param {*} totalAmount 
 * @param {*} callbackUrl 
 * @returns 
 */
export const createBillsPaymentTransaction = async ({ access_token, docId, clientRequestId, billerId, billDetails, paymentId, totalAmount, oneAedToPhp, convenienceFee, currencySymbol, currencyToPhp, callbackUrl }) => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")
  const userId = ls.get("userId")
  const uniqueId = uuidv4()

  const reqBody = {
    "docId": docId,
    "clientRequestId": `${clientRequestId}${uniqueId}`,
    "billerId": billerId,
    "billDetails": {
      ...billDetails
    },
    "callbackUrl": `${API}/vortex/bills-payment/callbackurl`,
    "userId": userId,
    "paymentId": paymentId,
    "totalAmount": totalAmount,
    "oneAedToPhp": oneAedToPhp,
    "convenienceFee": convenienceFee,
    "currencySymbol": currencySymbol,
    "currencyToPhp": currencyToPhp
  }

  return await fetch(`${API}/vortex/bills-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "access_token": `${access_token}`,
    },
    body: JSON.stringify(reqBody)
  })
    .then((response) => response)
    .catch((err) => err)
}


export const getBillers = async (access_token, pageNumber = 3, pageSize = 10) => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")


  return await fetch(`${API}/vortex/bills-payment/billers?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "access_token": access_token
    },

  })
    .then((response) => response)
    .catch((err) => err)
}

export const getBillerById = async (access_token, billerId) => {


  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")

  return await fetch(`${API}/vortex/bills-payment/billers/${billerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "access_token": access_token
    },

  })
    .then((response) => response)
    .catch((err) => err)
}


export const getBillspaymentTransactionByRefNumber = async (access_token, refNo) => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")

  return await fetch(`${API}/vortex/bills-payment/${refNo}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "access_token": access_token
    },

  })
    .then((response) => response)
    .catch((err) => err)
}


export const getTransactionByClientRequestId = async (access_token, clientRequestId) => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")

  return await fetch(`${API}/vortex/bills-payment/clientRequestId/${clientRequestId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "access_token": access_token
    },

  })
    .then((response) => response)
    .catch((err) => err)
}


export const getTransactionHistory = async (access_token, startDate, endDate, pageNumber, pageSize) => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")

  return await fetch(`${API}/vortex/bills-payment/history?startDate=${startDate}&endDate=${endDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "access_token": access_token
    },
  })
    .then((response) => response)
    .catch((err) => err)
}


