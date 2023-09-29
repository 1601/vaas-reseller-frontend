import React, { useState, useEffect } from "react"
import {
  AppBar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useParams } from "@reach/router"
import CenteredProgress from "../../misc/centeredProgress"
import {
  getVortexTransactionByRefId,
} from "../../../api/public/vortex/transaction_db/index"
import moment from 'moment-timezone';

// Wrap the require in check for window

// import printJS from 'print-js'
const printJS = typeof window !== `undefined` ? require("print-js") : null
const receipt = require('receipt');

receipt.config.currency = '$';
receipt.config.width = 40;
receipt.config.ruler = '-';

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  }
}

const VortexTransactionHistoryDetails = (props) => {

  let { type, refId } = useParams()

  const [isLoading, setIsLoading] = useState(true)

  const [errorData, setErrorData] = useState({
    isError: false,
    message: "",
  })

  const [copied, setCopied] = useState(false)

  const [inputsent, setInputSent] = useState(false)

  const [value, setValue] = useState(0)

  const [inputvalue, setInputValue] = useState("")

  const [inputvalueholder, setInputValueHolder] = useState("")

  const [forReceiptPrinting, setForReceiptPrinting] = useState(
    receipt.create(
      [
        {
          type: 'text', value: [
            'FirstAsian',
          ], align: 'center'
        },
        { type: 'empty' },
        {
          type: 'text', value: [
            'Please wait...',
          ], align: 'center'
        },
      ])
  )

  const [transaction, setTransaction] = useState(props.location.state)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  const [transactionDataFromSparkleDB, setTransactionDataFromSparkleDB] = useState(null)

  // const getTransactionByRefNumberTypeDef = async (
  //   access_token,
  //   refId,
  //   type
  // ) => {
  //   switch (type) {
  //     case "topup":
  //       return await getTransactionByRefNumber(access_token, refId)
  //     case "billspayment":
  //       return await getBillspaymentTransactionByRefNumber(access_token, refId)
  //     case "gift":
  //       return await getGiftTransactionByRefNumber(access_token, refId)
  //     default:
  //       return await getTransactionByRefNumber(access_token, refId)
  //   }
  // }



  useEffect(async () => {

    let latest = await getVortexTransactionByRefId({ refId });

    let transactionJson = await latest.json()

    await setTransaction(transactionJson)

    console.log("transactionJson", transactionJson)

    let ll = transactionJson;

    console.log("ll", ll)

    const output = receipt.create([
      {
        type: 'text', value: [
          'FirstAsian',
        ], align: 'center'
      },
      { type: 'empty' },
      {
        type: 'text', value: [
          ll?.store?.name,
          ll?.store?.address?.split("|")[0],
          ll?.store?.address?.split("|")[1],
          ll?.store?.address?.split("|")[2],
          ll?.store?.address?.split("|")[3],
          `TRN: ${ll?.store?.trn}`,
          `vortex.firstAsian@firstasian.com`,
          `+9112345678`,
        ], align: 'center'
      },
      { type: 'empty' },
      {
        type: 'text', value: [
          'Tax Invoice',
        ], align: 'center'
      },
      { type: 'empty' },
      {
        type: 'text', value: [
          `Invoice ID: ${ll?.referenceNumber}`,
          `Date: ${moment(ll?.createdAt).tz("Asia/Dubai").format("YYYY MMMM DD | hh:mm:ss a")}`,
          // `Date: ${moment(`${ll?.currentTransactionData?.dateCreated?.split("+")[0]}+0400`).format(
          //   "YYYY MMMM DD | hh:mm:ss a" // {name: 'United Arab Emirates : `(GMT+4)`} // timezone details
          // )}`,

          `SalesPerson Name: ${ll?.userId?.name}`,
          `Customer: ${ll?.customer?.name || 'No data!'}`,
        ], align: 'center'
      },
      { type: 'empty' },
      { type: 'empty' },
      type === 'topup' || type === 'gift' ? {
        type: 'table', lines: [
          { item: ll?.currentTransactionData?.productCode || ll?.currentTransactionData?.productName || ll?.currentTransactionData?.biller, qty: 1, cost: ll?.totalAmount * 100 }
          // topup
        ]
      } :
        {
          type: 'properties', lines: [
            { name: 'PAYMENT FOR', value: ll?.currentTransactionData?.biller },
          ]
        },
      { type: 'empty' },
      { type: 'empty' },
      {
        type: 'properties', lines: [
          { name: 'GST (10.00%)', value: `${parseFloat(ll?.totalAmount * 0.1).toFixed(2)} USD` },
          { name: 'Total amount (excl. GST)', value: `${parseFloat(ll?.totalAmount - ll.totalAmount * 0.1).toFixed(2)} USD` },
          { name: 'Total amount (incl. GST)', value: `${parseFloat(ll?.totalAmount).toFixed(2)} USD` }
        ]
      },
      { type: 'empty' },
      {
        type: 'properties', lines: [
          { name: 'Amount Received', value: `${parseFloat(ll?.totalAmount).toFixed(2)} USD` },
          { name: 'Amount Returned', value: `0.0 USD` }
        ]
      },
      { type: 'empty' },
      { type: 'text', value: 'Original', align: 'center' },
      { type: 'empty' },
      { type: 'text', value: 'This thermal paper needs to be kept', align: 'center', },
      { type: 'text', value: 'under 51 degrees Celcius to avoid damage', align: 'center', },
      { type: 'empty' },
      { type: 'text', value: 'Thank you', align: 'center', padding: 5 },
    ]);



    setForReceiptPrinting(output)

    /**
     * This code will only work on a topup transaction
     */
    if (ll?.currentTransactionData?.fulfillmentResponse?.isSuccess) {
      setTimeout(() => {
        printJS('iAmTheReceipt', 'html')
      }, 1000);
    }

    await setIsLoading(false);

  }, [])


  const transactionFormBuilder = (type) => {

    console.log("forReceiptPrinting", forReceiptPrinting)

    switch (type) {
      case "topup":
        return (
          <Stack id="forPrinting">
            <pre id="iAmTheReceipt" style={{ margin: 'auto' }}>

              <code>
                {`${forReceiptPrinting}`}
              </code>

            </pre>
            <div
              style={{
                display: "block",
                whiteSpace: "nowrap",
                padding: "8px 16px 16px",
              }}
            >
              <div
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  borderRadius: "4px",
                  display: "inline-block",
                  textAlign: "center",
                  height: "55px",
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={async () => {
                  console.log('print')
                  printJS('iAmTheReceipt', 'html')
                }}>
                <div style={{ margin: '0px 4vw', height: '24px', position: 'relative', top: '50%', transform: 'translateY(-50%)' }}>
                  <span style={{ fontSize: '20px', marginTop: '-2px', lineHeight: '24px' }}>PRINT RECEIPT</span>
                </div>
              </div>
            </div>
          </Stack>
        )
      case "billspayment":
        return (
          <Stack textAlign={"center"} spacing={2} id="forPrinting">
            <pre id="iAmTheReceipt" style={{ margin: 'auto' }}>
              <code >
                {`${forReceiptPrinting}`}
              </code>
            </pre>
            <div
              style={{
                display: "block",
                whiteSpace: "nowrap",
                padding: "8px 16px 16px",
              }}
            >
              <div
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  borderRadius: "4px",
                  display: "inline-block",
                  textAlign: "center",
                  height: "55px",
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={async () => {
                  console.log('print')
                  printJS('iAmTheReceipt', 'html')
                }}>
                <div style={{ margin: '0px 4vw', height: '24px', position: 'relative', top: '50%', transform: 'translateY(-50%)' }}>
                  <span style={{ fontSize: '20px', marginTop: '-2px', lineHeight: '24px' }}>PRINT RECEIPT</span>
                </div>
              </div>
            </div>
          </Stack>
        )
      case "gift":
        if (transaction) {
          return (
            <Stack textAlign={"center"} spacing={2} id="forPrinting">
              <pre id="iAmTheReceipt" style={{ margin: 'auto' }}>
                <code>
                  {`${forReceiptPrinting}`}
                </code>
              </pre>
              <div
                style={{
                  display: "block",
                  whiteSpace: "nowrap",
                  padding: "8px 16px 16px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "blue",
                    color: "white",
                    borderRadius: "4px",
                    display: "inline-block",
                    textAlign: "center",
                    height: "55px",
                    position: "relative",
                    width: "100%",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={async () => {
                    console.log('print')
                    printJS('iAmTheReceipt', 'html')
                  }}>
                  <div style={{ margin: '0px 4vw', height: '24px', position: 'relative', top: '50%', transform: 'translateY(-50%)' }}>
                    <span style={{ fontSize: '20px', marginTop: '-2px', lineHeight: '24px' }}>PRINT RECEIPT</span>
                  </div>
                </div>
              </div>
            </Stack>
          )
        }
      default:
        return (
          <Stack textAlign={"center"} spacing={2} id="forPrinting">
            <pre id="iAmTheReceipt" style={{ margin: 'auto' }}>
              <code >
                {`${forReceiptPrinting}`}
              </code>
            </pre>
            <div
              style={{
                display: "block",
                whiteSpace: "nowrap",
                padding: "8px 16px 16px",
              }}
            >
              <div
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  borderRadius: "4px",
                  display: "inline-block",
                  textAlign: "center",
                  height: "55px",
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={async () => {
                  console.log('print')
                  printJS('iAmTheReceipt', 'html')
                }}>
                <div style={{ margin: '0px 4vw', height: '24px', position: 'relative', top: '50%', transform: 'translateY(-50%)' }}>
                  <span style={{ fontSize: '20px', marginTop: '-2px', lineHeight: '24px' }}>PRINT RECEIPT</span>
                </div>
              </div>
            </div>
          </Stack>
        )
    }
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
          <Typography marginLeft={3} color={"black"}>
            Vortex transaction details
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      {isLoading && <CenteredProgress />}
      {!isLoading && (transaction.currentTransactionData?.fulfillmentResponse?.isSuccess || !(transaction?.status >= 400 || String(transaction?.status).toLowerCase() === "failed")) && (
        <Card elevation={10} style={{ margin: 10 }}>
          <CardContent>
            {transactionFormBuilder(type)}{" "}
          </CardContent>
        </Card>
      )}
      {(transaction?.status >= 400 || String(transaction?.status).toLowerCase() === "failed" || transaction.currentTransactionData?.fulfillmentResponse?.isSuccess === false) && ( //topup
        <Box m={3}>
          <Card elevation={10}>
            <CardContent>
              <Typography variant="h5">
                Reference Number: {props?.location?.state?.referenceNumber}
              </Typography>
              <Typography variant="h5">
                &nbsp;
              </Typography>
              <CircularProgress />
              <Typography variant="h6">
                Your order is being processed and will be fullfilled shortly .
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  )
}

export default VortexTransactionHistoryDetails
