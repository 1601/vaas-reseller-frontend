
export const getBasicAuthToken = () => {
  let token = Buffer(`${process.env.REACT_APP_VORTEX_CLIENT_KEY}:${process.env.REACT_APP_VORTEX_CLIENT_SECRET_KEY}`).toString('base64')
  return token
}