import SecureLS from "secure-ls"
import { API } from "../../../api-config"


export const getVortexProducts = async (access_token) => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")

  

  return await fetch(`${API}/vortex/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "access_token": `${access_token}`,
      },

    })
      .then((response) => {
        return response
      })
      .catch((err) => {
        
        return err
      })
}