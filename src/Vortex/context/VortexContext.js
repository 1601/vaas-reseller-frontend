import React, { useState, useEffect } from "react"
import { getVortexProducts } from "../../../api/public/vortex/product_service"
import { getVortexTokenBase } from "../../../api/public/vortex/token_service"
import socket from "../../../services/socketio"
import SecureLS from "secure-ls"

export const IsloadingProducts = React.createContext(false)

export const VortextProducts = React.createContext([])

export const VortexContextError = React.createContext({
  isError: false,
  message: "",
})

export const ReloadProductsTrigger = React.createContext(false)



const VortexContext = ({ children }) => {

  const ls = new SecureLS({ encodingType: "aes" })

  const [isLoading, setIsLoading] = useState(false)



  const [error, setErrorData] = useState({ isError: false, message: "" })

  const [vortexProductData, setVortexProductData] = useState([])

  const [retry, setRetry] = useState(false)





  const loadVortexProducts = async () => {
    setIsLoading(true)
    let vortexTokenResponse = await getVortexTokenBase()

    if (vortexTokenResponse.status === 200) {
      let vortextTokenResult = await vortexTokenResponse.json()
      let response = await getVortexProducts(vortextTokenResult.access_token)

      setIsLoading(false)
      if (response.status === 200) {
        let result = await response.json()

        setVortexProductData(result)

      } else {
        let result = await response.json()
        setIsLoading(false)
        setErrorData({
          isError: true,
          message: result.error.message,
        })
      }
    } else {
      let vortextTokenResult = await vortexTokenResponse.json()
      setIsLoading(false)
      setErrorData({
        isError: true,
        message: vortextTokenResult.error.message,
      })
    }
  }


  useEffect(() => {
    loadVortexProducts()

  }, [retry])





  return (
    <ReloadProductsTrigger.Provider value={[retry, setRetry]}>
      <VortexContextError.Provider value={[error, setErrorData]}>
        <IsloadingProducts.Provider value={[isLoading, setIsLoading]}>
          <VortextProducts.Provider
            value={[vortexProductData, setVortexProductData]}
          >

            {children}

          </VortextProducts.Provider>
        </IsloadingProducts.Provider>
      </VortexContextError.Provider>
    </ReloadProductsTrigger.Provider>
  )
}

export default VortexContext
