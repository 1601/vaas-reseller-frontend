import { API } from "../../api-config"

export const getStoreEnvById = async ({ storeEnvId }) => {

  return fetch(`${API}/storeenv/id/${storeEnvId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status !== 200) {
        throw Error("Unable to get stores")
      }
      return response.json()
    })
    .catch((err) => {
      return err
    })
}
