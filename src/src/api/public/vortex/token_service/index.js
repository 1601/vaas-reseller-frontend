/* eslint-disable arrow-body-style */
/* eslint-disable no-return-await */
import SecureLS from "secure-ls"
import { API } from "../../../api-config"

export const getVortexTokenBase = async () => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")


  return await fetch(`${API}/vortex/token`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })
    .then((response) => {
      return response
    })
    .catch((err) => {
      
      return err
    })
}

export const signIn = async (email, password) => await fetch(`${API}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then(async (response) => {
      if (response.status !== 200) {
        const jsonData = await response.json()
        throw Error(JSON.stringify(jsonData))
      }
      const ls = new SecureLS({ encodingType: "aes" })
      const { token } = await response.json()
      ls.set("token", token)
      
      return response;
    })
    .catch((err) => {

      throw err
    })