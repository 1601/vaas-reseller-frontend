import { API } from "../../../api-config"
import SecureLS from "secure-ls"
import { v4 as uuidv4 } from 'uuid';
import { parse } from "date-fns";

export const getGiftCategories = async (access_token) => {

  return await fetch(`${API}/vortex/gift/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "access_token": access_token
    },

  })
    .then((response) => {
      return response
    })
    .catch((err) => {

      return err
    })
}


export const getGiftSubCategories = async ({ access_token, category = "Food" }) => {

  return await fetch(`${API}/vortex/gift/subcategories?category=${category}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "access_token": access_token
    },

  })
    .then((response) => {
      return response
    })
    .catch((err) => {

      return err
    })
}

export const getGiftTransactionByRefNumber = async (access_token, refNo) => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")

  return await fetch(`${API}/vortex/gift/transaction/${refNo}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "access_token": access_token
    },

  })
    .then((response) => {
      return response
    })
    .catch((err) => {

      return err
    })
}

/**
 * 
 * @param {*} docId - this is the mongodbId
 * @returns 
 */
export const createGiftPurchaseTransaction = async (
  { access_token,
    docId,
    productCode,
    clientRequestId,
    senderName,
    senderMobile,
    senderEmail,
    recipientName,
    recipientMobile,
    recipientEmail,
    quantity,
    message,
    paymentId,
    totalAmount,
    oneAedToPhp,
    convenienceFee,
    currencySymbol,
    currencyToPhp,
  }) => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")
  const userId = ls.get("userId")
  let uniqueId = uuidv4()



  let reqBody = {
    "docId": docId,
    "productCode": productCode.trim(),
    "clientRequestId": `${clientRequestId}${uniqueId}`,
    "senderName": senderName.trim(),
    "senderMobile": senderMobile.trim(),
    "senderEmail": senderEmail.trim(),
    "recipientName": recipientName.trim(),
    "recipientMobile": recipientMobile.trim(),
    "recipientEmail": recipientEmail.trim(),
    "quantity": parseInt(quantity),
    "message": message,
    "userId": userId,
    "paymentId": paymentId,
    "totalAmount": totalAmount,
    "oneAedToPhp": oneAedToPhp,
    "convenienceFee": convenienceFee,
    "currencySymbol": currencySymbol,
    "currencyToPhp": currencyToPhp
  }

  return await fetch(`${API}/vortex/gift`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "access_token": `${access_token}`,
    },
    body: JSON.stringify(reqBody)
  })
    .then((response) => {
      return response
    })
    .catch((err) => {

      return err
    })
}