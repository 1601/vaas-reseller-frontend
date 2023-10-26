import SecureLS from "secure-ls"
import { API } from "../../../api-config"

export const getVortexProducts = async (accessToken) => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")

  return fetch(`${API}/vortex/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "access_token": `${accessToken}`, 
      },

    })
      .then((response) => {
        return response
      })
      .catch((err) => {
        return err
      })
}
