/* eslint-disable no-return-await */
/* eslint-disable no-useless-catch */
import SecureLS from "secure-ls"
import { API } from "../../../api-config"


export const saveVortexTopUpTransaction = async ({ referenceNumber, transactionData = { "message": null }, requestInputPayload, paymentId = "empty", totalAmount = 0 }) => {

  try {
    const ls = new SecureLS({ encodingType: "aes" })
    const token = ls.get("token")
    const userId = ls.get("userId")
    const store = ls.get("store")
    const customer = ls.get("currentCustomer")

    console.log(store)
    
    // Default values
    const defaultReferenceNumber = '123456789'; 
    const defaultUserId = '5ff4481563135b0017a60a82'; 
    const defaultStoreId = 'default_store_id'; 
    const defaultCustomerId = 'guest_id';
    
    const reqBody = {
      // "referenceNumber": referenceNumber || defaultReferenceNumber,
      // "paymentId": paymentId || 'default_payment_id',
      // "store": store?._id || defaultStoreId,
      // "customer": customer?._id || defaultCustomerId
      "userId": userId || defaultUserId,
      "transactionData": JSON.stringify(transactionData || { "message": "default message" }),
      "requestInputPayload": JSON.stringify(requestInputPayload),
      "totalAmount": totalAmount,
      "convenienceFee": totalAmount,
    };

    console.log('Making a POST request to:', `${API}/vortex/transaction/topup`);
    console.log('Request headers:', {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    });
    console.log('Request body:', reqBody);

    return await fetch(`${API}/vortex/transaction/topup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(reqBody)
    })
      .then((response) => {
        if (response.status !== 200) {
          throw Error("Failed creating a vortex transaction")
        }
        return response.json()
      })
      .catch((err) => {
        throw err
      })
  } catch (error) {
    throw error
  }
}

export const saveVortexBillsPaymentTransaction = async ({ referenceNumber, transactionData = { "message": null }, requestInputPayload, paymentId = "empty", totalAmount }) => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")
  const userId = ls.get("userId")
  const store = ls.get("store")
  const customer = ls.get("currentCustomer")

  const reqBody = {
    "referenceNumber": referenceNumber,
    "userId": `${userId}`,
    "transactionData": JSON.stringify(transactionData),
    "requestInputPayload": JSON.stringify(requestInputPayload),
    "paymentId": paymentId,
    "totalAmount": totalAmount,
    "store": store?._id,
    "customer": customer?._id
  }

  return await fetch(`${API}/vortex/transaction/billspayment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(reqBody)
  })
    .then((response) => {
      if (response.status !== 200) {
        throw Error("Failed creating a vortex transaction")
      }
      return response.json()
    })
    .catch((err) => {

      throw err
    })
}


export const saveVortexGiftTransaction = async ({ referenceNumber, transactionData = { "message": null }, requestInputPayload, paymentId = "empty", totalAmount }) => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")
  const userId = ls.get("userId")
  const store = ls.get("store")
  const customer = ls.get("currentCustomer")

  const reqBody = {
    "referenceNumber": referenceNumber,
    "userId": `${userId}`,
    "transactionData": JSON.stringify(transactionData),
    "requestInputPayload": JSON.stringify(requestInputPayload),
    "paymentId": paymentId,
    "totalAmount": totalAmount,
    "store": store?._id,
    "customer": customer?._id
  }

  return await fetch(`${API}/vortex/transaction/gift`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(reqBody)
  })
    .then((response) => {
      if (response.status !== 200) {
        throw Error("Failed creating a vortex transaction")
      }
      return response.json()
    })
    .catch((err) => {
      throw err

    })
}


export const getAllVortexTransactions = async () => { // cashier

  // const ls = new SecureLS({ encodingType: "aes" })
  // const token = ls.get("token")
  // const userId = ls.get("userId")
  
  const userId = "5f73fde5648d74001786007a" // test userId


  return await fetch(`http://localhost:5000/v1/api/vortex/transactions/all/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${token}`,
    },
  })
    .then((response) => response)
    .catch((err) => err)
}

export const getAllVortexTransactionsCustomer = async () => { // customer

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")
  const userId = ls.get("userId")
  const currentCustomer = ls.get("currentCustomer")


  return await fetch(`${API}/vortex/transaction/all-customer/${currentCustomer._id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })
    .then((response) => response)
    .catch((err) => err)
}


export const getVortexTransactionByRefId = async ({ refId }) => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")



  return await fetch(`${API}/vortex/transaction/byref/${refId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })
    .then((response) => response)
    .catch((err) => err)
}


export const updateVortexByRefId = async ({ refId, data }) => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")

  const reqBody = data

  return await fetch(`${API}/vortex/transaction/update/${refId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(reqBody)
  })
    .then((response) => {
      if (response.status !== 200) {
        throw Error("Failed creating a vortex transaction")
      }
      return response.json()
    })
    .catch((err) => {
      throw err
    })
}

export const getAllByDateRange = async( startDate, endDate ) => {
  console.log(startDate, endDate)

  // const ls = new SecureLS({ encodingType: "aes" })
  // const token = ls.get("token")

  // const reqBody = data

  const userId = "5f73fde5648d74001786007a" // test userId

  return await fetch(`http://localhost:5000/v1/api/vortex/transactions/all/${userId}/data?startDate=${startDate}&endDate=${endDate}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${token}`,
    }
  })
    .then((response) => {
      if (response.status !== 200) {
        throw Error("Failed creating a vortex transaction")
      }
      return response.json()
    })
    .catch((err) => {
      throw err
    })
}










