
import { API } from "../../../api-config"
import SecureLS from "secure-ls"

export const getTransactionByRefNumber = async (access_token, pin, sku) => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")


  return await fetch(`${API}/pins?productCode=${pin}${sku}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "access_token": access_token,
      },

    })
      .then((response) => {
        return response
      })
      .catch((err) => {
        
        return err
      })
}