
import { API } from "../../../api-config"
import SecureLS from "secure-ls"

export const getWallets = async (access_token) => {

  const ls = new SecureLS({ encodingType: "aes" })
  const token = ls.get("token")


  return await fetch(`${API}/vortex/wallets`, {
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