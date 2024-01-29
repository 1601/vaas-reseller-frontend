import React, { useState, useEffect, useContext } from "react"
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  Toolbar,
  Typography,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { navigate } from "gatsby"
import { LoginState } from "../../globalstates"
import Login from "../../LoginPage"
import VortexTransactionListItem from "../components/VortexTransactionListItem"
import { getAllVortexTransactionsCustomer } from "../../../api/public/vortex/transaction_db"
import CenteredProgress from "../../misc/centeredProgress"
import HistoryIcon from "@mui/icons-material/History"

import NoDataFound from "../../misc/NoDataFound"

const VortexTransactionHistoryCustomer = () => {
  const [isLoggin, setisLoggin] = useContext(LoginState)

  const [isLoading, setIsLoading] = useState(false)

  const [transactions, setTransactions] = useState([])

  const [renderData, setRenderData] = useState([])



  useEffect(async () => {
    setIsLoading(true)
    let response = await getAllVortexTransactionsCustomer()

    if (response.status === 200) {
      let result = await response.json()
      // console.log(result)
      setTransactions(result)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (transactions.length > 0) {
      setRenderData(transactions)
    }
  }, [transactions])

  if (!isLoggin) {
    return <Login showBackButton={true} />
  }

  return (
    <Box>
      <AppBar position="fixed" style={{ background: "#ffffff" }}>
        <Toolbar>
          <IconButton
            onClick={() => {
              navigate(-1)
            }}
            style={{ color: "black" }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            marginLeft={3}
            color={"black"}
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Vortex Transactions
          </Typography>
          {/* <IconButton
            style={{ color: "black" }}
            onClick={() => {
              showPaymongoRefundDialog()
            }}
          >
            <HistoryIcon />
          </IconButton> */}
        </Toolbar>
      </AppBar>
      <Toolbar />
      {isLoading && <CenteredProgress />}
      {renderData.length <= 0 && !isLoading && <NoDataFound />}
      <List>
        {renderData.map((v) => {

           if(v.currentTransactionData?.fulfillmentResponse?.isSuccess // topup meralco load
            || v.currentTransactionData?.statusDescription === "Completed" //voucher jollibee
            || v.currentTransactionData?.status === "Completed" //topup meralco load again

            ) { //useRenderDAta reducer todo for a  better handling of no data found
              return (
                <VortexTransactionListItem
                  title={
                    v.referenceNumber !== "undefined"
                      ? v.referenceNumber
                      : "Failed transaction"
                  }
                  createdAt={v.createdAt}
                  onClick={() => {
                    navigate(`/vortextransactions/${v.type}/${v.referenceNumber}`, { state: v })
                  }}
                />
              )
            }
          })
          }
      </List>

    </Box>
  )
}

export default VortexTransactionHistoryCustomer
