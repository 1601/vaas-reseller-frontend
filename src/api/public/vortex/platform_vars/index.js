import { API } from "../../../api-config";

export const getPlatformVariables = async () => {
  const response = await fetch(`${API}/auth/platform-variables`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status !== 200) {
    throw Error("Critical Error unable to get platform variables");
  }

  const jsonData = await response.json();

  return jsonData;
};
