import { useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box, List, AppBar, Toolbar, IconButton, 
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Slider,
  Stack,
  Grid, } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"

import vortexBillsPaymentCategories from '../_mock/vortex_billspayment_categories';
import vortexBillspaymentProducts from '../_mock/vortex_billspayment';

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function VortexBills() {

  const navigate = useNavigate()

  // const [activeStep, setActiveStep] = useState(0)

  // const [data, setData] = useState([])

  // const [renderData, setRenderData] = useState([])

  // const [categories, setcategories] = useState(vortexBillsPaymentCategories)

  // const [selectedBiller, setSelectedBiller] = useState(null)

  // const [billDetails, setBillDetails] = useState(null)

  // const [inputFormData, setinputFormData] = useState({})

  // const [transactionDetails, setTransactionDetails] = useState()

  // const [currentSelectedCategory, setCurrentSelectedCategory] = useState(null)
  
  // const [_billers, _setBillers] = useState([])
  // const [search, setSearch] = useState([])

  //   const [_currentSelectedCategory, _setCurrentSelectedCategory] = useReducer(
  //     filterBillerByCategories,
  //     ""
  //   )

  //   // This will filter all biller by categories 
  //   function filterBillerByCategories(state, category) {
  //     const filteredBillers = []
  //     if (vortexBillspaymentProducts.docs?.length > 0) {
  //       // eslint-disable-next-line 
  //       for (let index = 0; index < vortexBillspaymentProducts?.docs?.length; index++) {
  //         if (vortexBillspaymentProducts?.docs[index]?.category === category) {
  //           filteredBillers.push(getBillerAbbreviation(vortexBillspaymentProducts?.docs[index]))
  //         }
  //       }
  //       _setBillers(filteredBillers)
  //     }

  //     return category
  //   }

  //   function searchBillers(search) {
  //     if (search.trim().replaceAll(" ", "").length === 0) {
  //       setSearch([])
  //       return
  //     }

  //     const filteredBillers = []
  //     if (vortexBillspaymentProducts?.docs?.length > 0) {
  //       // eslint-disable-next-line 
  //       for (let index = 0; index < vortexBillspaymentProducts?.docs?.length; index++) {
  //         const billerName = vortexBillspaymentProducts?.docs[index].name
  //           .toLowerCase()
  //           .replaceAll(" ", "")
  //         if (billerName.includes(search.toLowerCase()))
  //           filteredBillers.push(vortexBillspaymentProducts?.docs[index])
  //       }
  //     }

  //     setSearch(filteredBillers)
  //   }

  const [selectedCategory, setSelectedCategory] = useState(null)

    const categories1 = [
      {
        "name": "loans",
        "products": [
          {
            "id": "5e5f1d7902e76a0017d0ee12",
            "name": "99HELP LENDING CORPORATION",
            "allowValidate": 0
          },
          {
            "id": "5e5f712602e76a0017d0ee3e",
            "name": "ASTERIA Lending Inc.",
            "allowValidate": 0
          },
          {
            "id": "5e5f226f02e76a0017d0ee19",
            "name": "CASH MART ASIA LENDING INC",
            "allowValidate": 0
          },
          {
            "id": "5e5f716f02e76a0017d0ee3f",
            "name": "CREDITBPO TECH INC",
            "allowValidate": 0
          },
          {
            "id": "5e5f71c002e76a0017d0ee40",
            "name": "Cropital",
            "allowValidate": 0
          },
          {
            "id": "5e5f232302e76a0017d0ee1b",
            "name": "FUNDKO, INC.",
            "allowValidate": 0
          },
          {
            "id": "5d68c359841d900011dd3e6f",
            "name": "Global Mobility Services",
            "allowValidate": 0
          },
          {
            "id": "5e5f247702e76a0017d0ee1d",
            "name": "Green Money Tree Lending Corp.",
            "allowValidate": 0
          },
          {
            "id": "5e5f3c6a02e76a0017d0ee1e",
            "name": "Lendeez",
            "allowValidate": 0
          },
          {
            "id": "5e5f74ea02e76a0017d0ee41",
            "name": "MOOLALENDING",
            "allowValidate": 0
          },
          {
            "id": "5e5f413b02e76a0017d0ee26",
            "name": "ROBOCASH FINANCE PHILIPPINES",
            "allowValidate": 0
          },
          {
            "id": "5e5f756402e76a0017d0ee42",
            "name": "Radiowealth Finance",
            "allowValidate": 0
          },
          {
            "id": "5e5f760102e76a0017d0ee43",
            "name": "YesCredit Financing Inc",
            "allowValidate": 0
          },
          {
            "id": "5d67a3aa841d900011dd3e44",
            "name": "Asialink",
            "allowValidate": 0
          },
          {
            "id": "640648176312065b36aea2f9",
            "name": "CASHALO",
            "allowValidate": 1
          },
          {
            "id": "5d67a6e6841d900011dd3e4c",
            "name": "Easycash lending Company",
            "allowValidate": 0
          },
          {
            "id": "5d67ba1a841d900011dd3e52",
            "name": "Finaswide",
            "allowValidate": 0
          },
          {
            "id": "5cf0ccaa03dd350010b28539",
            "name": "Pahiram",
            "allowValidate": 0
          }
        ]
      },
      {
        "name": "phone and internet",
        "products": [
          {
            "id": "5e60613e02e76a0017d0ee4e",
            "name": "ABSMOBILE",
            "allowValidate": 0
          },
          {
            "id": "5cf0e45603dd350010b2853d",
            "name": "Bayantel",
            "allowValidate": 0
          },
          {
            "id": "5e6061fd02e76a0017d0ee4f",
            "name": "Digitel Communications",
            "allowValidate": 0
          },
          {
            "id": "628ca80b8fb8280018805b75",
            "name": "Globelines (Innove Communications -- landline and internet)",
            "allowValidate": 0
          },
          {
            "id": "640648176312065b36aea2f1",
            "name": "GLOBE",
            "allowValidate": 1
          },
          {
            "id": "5cf09eed03dd350010b28530",
            "name": "PLDT",
            "allowValidate": 0
          },
          {
            "id": "640648176312065b36aea2ec",
            "name": "SMART",
            "allowValidate": 1
          }
        ]
      },
      {
        "name": "insurance and financial services",
        "products": [
          {
            "id": "5e5f48f002e76a0017d0ee30",
            "name": "AFP General Insurance",
            "allowValidate": 0
          },
          {
            "id": "5e5f495a02e76a0017d0ee31",
            "name": "ALLIEDBANKERS INSURANCE CORPORATION",
            "allowValidate": 0
          },
          {
            "id": "5e5f4b8d02e76a0017d0ee34",
            "name": "CIBELES INSURANCE CORPORATION",
            "allowValidate": 0
          },
          {
            "id": "5e5f4d0002e76a0017d0ee36",
            "name": "ETERNAL PLANS, INC.",
            "allowValidate": 0
          },
          {
            "id": "5e5f778402e76a0017d0ee44",
            "name": "FWD Life Insurance Corporation",
            "allowValidate": 0
          },
          {
            "id": "5e5f4d9c02e76a0017d0ee37",
            "name": "FWD Peace",
            "allowValidate": 0
          },
          {
            "id": "5e5f4dda02e76a0017d0ee38",
            "name": "LEX Services",
            "allowValidate": 0
          },
          {
            "id": "5e5f53d702e76a0017d0ee39",
            "name": "LOYOLA PLANS CONSOLIDATED INC.",
            "allowValidate": 0
          },
          {
            "id": "5e5f599202e76a0017d0ee3c",
            "name": "NEW CANAAN INSURANCE AGENCY, INC",
            "allowValidate": 0
          },
          {
            "id": "5e5f3fde02e76a0017d0ee24",
            "name": "Philippine Life Financial Assurance Corporation",
            "allowValidate": 0
          },
          {
            "id": "5d6747b0841d900011dd3e2a",
            "name": "AXA Philippines (Charter Ping An)",
            "allowValidate": 0
          },
          {
            "id": "5d67bafb841d900011dd3e53",
            "name": "FUSE LENDING INC",
            "allowValidate": 0
          },
          {
            "id": "5d664f76841d900011dd3e0d",
            "name": "Gloriosa Finance Corp",
            "allowValidate": 0
          },
          {
            "id": "5d6778b2841d900011dd3e39",
            "name": "Paramount Life & General Insurance Corporation",
            "allowValidate": 0
          },
          {
            "id": "5d679a41841d900011dd3e3a",
            "name": "Philamlife",
            "allowValidate": 0
          },
          {
            "id": "5d679c1e841d900011dd3e3e",
            "name": "Prudential Life",
            "allowValidate": 0
          },
          {
            "id": "5d679d6b841d900011dd3e40",
            "name": "Standard Insurance",
            "allowValidate": 0
          },
          {
            "id": "5d679f42841d900011dd3e41",
            "name": "Sun Life of Canada Phils",
            "allowValidate": 0
          },
          {
            "id": "5d674c02841d900011dd3e2d",
            "name": "United Coconut Planters Life Assurance Corporation (COCOLIFE)",
            "allowValidate": 0
          }
        ]
      },
      {
        "name": "payment gateway",
        "products": [
          {
            "id": "5e5f1e4702e76a0017d0ee14",
            "name": "ASIAPAY PAYMENT TEHNOLOGY CORPORATION",
            "allowValidate": 0
          },
          {
            "id": "5e5f1dc202e76a0017d0ee13",
            "name": "Alipay PH",
            "allowValidate": 0
          },
          {
            "id": "5e5f1f3502e76a0017d0ee15",
            "name": "BTCEXCHANGE.PH",
            "allowValidate": 0
          },
          {
            "id": "5e5f1f8602e76a0017d0ee16",
            "name": "Bux.Com Global Limited",
            "allowValidate": 0
          },
          {
            "id": "5e5f1fe402e76a0017d0ee17",
            "name": "BuyBitcoin.ph",
            "allowValidate": 0
          }
        ]
      },
      {
        "name": "consumer finance",
        "products": [
          {
            "id": "5e5f22d302e76a0017d0ee1a",
            "name": "E-PESO",
            "allowValidate": 0
          },
          {
            "id": "5e5f238902e76a0017d0ee1c",
            "name": "Global Pinoy Remittance and Services Inc.",
            "allowValidate": 0
          },
          {
            "id": "5e5f3db802e76a0017d0ee1f",
            "name": "MetisEtrade",
            "allowValidate": 0
          },
          {
            "id": "5e5f3e2c02e76a0017d0ee20",
            "name": "Microbnk",
            "allowValidate": 0
          },
          {
            "id": "5e5f3e6e02e76a0017d0ee21",
            "name": "Nexus R Forward Finance, Inc",
            "allowValidate": 0
          },
          {
            "id": "5e5f408002e76a0017d0ee25",
            "name": "PROXIMITY FUNDING CREDIT COOPERATIVE",
            "allowValidate": 0
          },
          {
            "id": "5e5f3f8a02e76a0017d0ee23",
            "name": "Payoneer",
            "allowValidate": 0
          },
          {
            "id": "5e5f41f402e76a0017d0ee28",
            "name": "TOUCAN",
            "allowValidate": 0
          },
          {
            "id": "5e5f419302e76a0017d0ee27",
            "name": "Tapp Commerce",
            "allowValidate": 0
          },
          {
            "id": "5e5f429302e76a0017d0ee29",
            "name": "VMoney",
            "allowValidate": 0
          },
          {
            "id": "5e5f431902e76a0017d0ee2a",
            "name": "Wealth Finance Inc.",
            "allowValidate": 0
          }
        ]
      },
      {
        "name": "electricity",
        "products": [
          {
            "id": "5e5f7a9502e76a0017d0ee47",
            "name": "ISABELA 1 ELECTRIC COOPERATIVE INC. (ISELCO I)",
            "allowValidate": 0
          },
          {
            "id": "5e6060e502e76a0017d0ee4c",
            "name": "TARLAC I ELETRIC COOPERATIVE, INC. (TARELCO I)",
            "allowValidate": 0
          },
          {
            "id": "5d68cc43841d900011dd3e77",
            "name": "ALBAY POWER AND ENERGY CORP.(APEC)",
            "allowValidate": 0
          },
          {
            "id": "5d68ccd1841d900011dd3e78",
            "name": "Angeles Electric Corporation",
            "allowValidate": 0
          },
          {
            "id": "640648176312065b36aea2f8",
            "name": "BENECO",
            "allowValidate": 1
          },
          {
            "id": "5d68cebf841d900011dd3e7b",
            "name": "Batangas 2 Electric Cooperative Inc. (BATELEC2)",
            "allowValidate": 0
          },
          {
            "id": "5d68d40c841d900011dd3e81",
            "name": "Camarines Sur II Electric Cooperative(CASURECO2)",
            "allowValidate": 0
          },
          {
            "id": "5d68d4b1841d900011dd3e82",
            "name": "Cebu II Electric Cooperative (CEBECO2)",
            "allowValidate": 0
          },
          {
            "id": "5d68d5c9841d900011dd3e84",
            "name": "Cotabato Light",
            "allowValidate": 0
          },
          {
            "id": "640648176312065b36aea2f3",
            "name": "DAVAO LIGHT",
            "allowValidate": 1
          },
          {
            "id": "5d6ccf40841d900011dd3e8f",
            "name": "Ilocos Sur Electric Cooperative, Inc.(ISECO)",
            "allowValidate": 0
          },
          {
            "id": "5d6cedb7841d900011dd3e94",
            "name": "Lima Enerzone Corporation",
            "allowValidate": 0
          },
          {
            "id": "5ced0bd0faac810017bef177",
            "name": "MERALCO",
            "allowValidate": 0
          },
          {
            "id": "5d6d04f6841d900011dd3e9e",
            "name": "OLONGAPO ELECTRICITY DISTRIBUTION COMPANY INC. (OEDC)",
            "allowValidate": 0
          },
          {
            "id": "5d6d08b3841d900011dd3ea0",
            "name": "Pampanga 1 Elec Coop. Inc. (PELCO1)",
            "allowValidate": 0
          },
          {
            "id": "5d6e15f7841d900011dd3ea2",
            "name": "Pampanga Rural Electric Service Coop. (PRESCO)",
            "allowValidate": 0
          },
          {
            "id": "5d6e4433841d900011dd3eac",
            "name": "SORSOGON II ELECTRIC COOPERATIVE, INC (SORECO II)",
            "allowValidate": 0
          },
          {
            "id": "5d6f5dfb841d900011dd3eaf",
            "name": "Subic Enerzone",
            "allowValidate": 0
          }
        ]
      },
      {
        "name": "real estate",
        "products": [
          {
            "id": "5e60611002e76a0017d0ee4d",
            "name": "MAGNIFICAT VENTURES CORP. (MVC - St. Theres Columbarium)",
            "allowValidate": 0
          }
        ]
      },
      {
        "name": "government",
        "products": [
          {
            "id": "5e5f445e02e76a0017d0ee2c",
            "name": "Maritime Industry Authority",
            "allowValidate": 0
          },
          {
            "id": "5e5f45ef02e76a0017d0ee2e",
            "name": "PNP License To Own and Possess Firearm (LTOPF)",
            "allowValidate": 0
          },
          {
            "id": "62f0c36b0a80120019dab271",
            "name": "Pag-IBIG Contribution",
            "allowValidate": 0
          },
          {
            "id": "62f0c4698fb8280018805bb3",
            "name": "Pag-IBIG Housing Loan",
            "allowValidate": 0
          },
          {
            "id": "62f0c4f88fb8280018805bb4",
            "name": "Pag-IBIG MP2 Savings",
            "allowValidate": 0
          },
          {
            "id": "62f0aecf0a80120019dab270",
            "name": "SSS Contribution",
            "allowValidate": 0
          },
          {
            "id": "62f0b3718fb8280018805bb1",
            "name": "SSS Miscellaneous",
            "allowValidate": 0
          },
          {
            "id": "62f0b5b98fb8280018805bb2",
            "name": "SSS P.E.S.O Fund",
            "allowValidate": 0
          },
          {
            "id": "5d666c36841d900011dd3e1e",
            "name": "National Bureau of Investigation (NBI)",
            "allowValidate": 0
          },
          {
            "id": "5e311d2402e76a0017d0edf2",
            "name": "National Housing Authority (NHA)",
            "allowValidate": 0
          },
          {
            "id": "640648176312065b36aea305",
            "name": "PAG-IBIG",
            "allowValidate": 1
          }
        ]
      },
      {
        "name": "healthcare",
        "products": [
          {
            "id": "5e5f585402e76a0017d0ee3a",
            "name": "Maxicare",
            "allowValidate": 0
          },
          {
            "id": "5e5f5a6602e76a0017d0ee3d",
            "name": "Philcare",
            "allowValidate": 0
          }
        ]
      },
      {
        "name": "cable tv and internet",
        "products": [
          {
            "id": "5e5f1c6902e76a0017d0ee10",
            "name": "Royal Cable",
            "allowValidate": 0
          },
          {
            "id": "640648176312065b36aea2ee",
            "name": "CIGNAL",
            "allowValidate": 1
          },
          {
            "id": "640648176312065b36aea2f2",
            "name": "CONVERGE",
            "allowValidate": 1
          },
          {
            "id": "5cf07d1603dd350010b28529",
            "name": "Cablelink",
            "allowValidate": 0
          }
        ]
      },
      {
        "name": "banks",
        "products": [
          {
            "id": "5e5f469b02e76a0017d0ee2f",
            "name": "Tanay Rural Bank",
            "allowValidate": 0
          },
          {
            "id": "5d67afbe841d900011dd3e4e",
            "name": "Equicom Savings",
            "allowValidate": 0
          },
          {
            "id": "5d6668d0841d900011dd3e1c",
            "name": "Union Bank Visa Credit",
            "allowValidate": 0
          }
        ]
      },
      {
        "name": "airlines",
        "products": [
          {
            "id": "5cef87bb03dd350010b2851f",
            "name": "AirAsia",
            "allowValidate": 0
          },
          {
            "id": "5cf0e24403dd350010b2853b",
            "name": "Cebu Pacific",
            "allowValidate": 0
          }
        ]
      },
      {
        "name": "water",
        "products": [
          {
            "id": "5cf0ecb103dd350010b2853f",
            "name": "BP Waterworks Inc.",
            "allowValidate": 0
          },
          {
            "id": "5e302c4a02e76a0017d0edee",
            "name": "Baliwag Water District",
            "allowValidate": 0
          },
          {
            "id": "5d68d1db841d900011dd3e7f",
            "name": "CAGAYAN DE ORO WATER (COWD)",
            "allowValidate": 0
          },
          {
            "id": "5d68d56c841d900011dd3e83",
            "name": "CLARK WATER CORPORATION",
            "allowValidate": 0
          },
          {
            "id": "5d6ccb5b841d900011dd3e8d",
            "name": "Happy Well Management and Collection Services Inc",
            "allowValidate": 0
          },
          {
            "id": "640648176312065b36aea2f4",
            "name": "LAGUNA WATER",
            "allowValidate": 1
          },
          {
            "id": "5cf0c53003dd350010b28536",
            "name": "LAGUNA WATER CORPORATION",
            "allowValidate": 0
          },
          {
            "id": "5d6ceaac841d900011dd3e92",
            "name": "LAGUNA WATER DISTRICT AQUATECH RESOURCES CORP.",
            "allowValidate": 0
          },
          {
            "id": "5d6ceca3841d900011dd3e93",
            "name": "Legazpi Water",
            "allowValidate": 0
          },
          {
            "id": "5ced0f00faac810017bef178",
            "name": "MAYNILAD WATER SERVICES",
            "allowValidate": 0
          },
          {
            "id": "5d6d042e841d900011dd3e9d",
            "name": "Obando Water District",
            "allowValidate": 0
          },
          {
            "id": "5d6e18e5841d900011dd3ea6",
            "name": "Pili Water District",
            "allowValidate": 0
          },
          {
            "id": "5d6e1a19841d900011dd3ea7",
            "name": "Plaridel Water District",
            "allowValidate": 0
          },
          {
            "id": "5d6e1c1e841d900011dd3ea8",
            "name": "Primewater",
            "allowValidate": 0
          },
          {
            "id": "5d6f5a64841d900011dd3eae",
            "name": "Sta. Maria Water District (SMWD)",
            "allowValidate": 0
          },
          {
            "id": "5d6f5f6e841d900011dd3eb1",
            "name": "Tabaco Water (TAWAD)",
            "allowValidate": 0
          },
          {
            "id": "5d6f680c841d900011dd3eb3",
            "name": "Tagum Water District",
            "allowValidate": 0
          }
        ]
      },
      {
        "name": "transportation",
        "products": [
          {
            "id": "640648176312065b36aea2fe",
            "name": "EASYTRIP RFID",
            "allowValidate": 1
          }
        ]
      }
    ];

    const [expanded, setExpanded] = useState(false)

    const handleChange = (panel) => (event, isExpanded) => {
      console.log(panel)
      setSelectedCategory(panel.name)
      setExpanded(isExpanded ? panel.name : false)
    }
  

  return (
    <>
      <Helmet>
        <title> Bills Payment | VAAS </title>
      </Helmet>
      <AppBar
      position="fixed"
      // style={{ background: primaryVortexTheme.accentColor }}
    >
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
          }}
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => {
              // go back previous page
              // 
              console.log("go back previous page");
              // 
              window.history.back();
              // eslint-disable-next-line react-hooks/rules-of-hooks
              navigate(-1);
            }}
          >
            <ChevronLeftIcon style={{ color: "white" }} />
          </IconButton>
          <Typography
            component="div"
            sx={{ flexGrow: 1, color: "white", marginTop: "0.4em", textAlign: 'center', paddingTop: '4%' }}
          >
            Bills Payment
          </Typography>
        </div>
        {/* <div style = {{
          display: 'flex', 
          fontSize: '10px'
        }}>
          <p >powered by </p>
          <img
            style={{
              width: "61px",
              height: "21.4px",
              marginTop: '6px'
            }}
            src={Logo}
            alt="Spark Waving burstless"
          />
        </div> */}
      </Toolbar>
    </AppBar>

      {/* <Container sx={{backgroundColor: "#fff"}}> */}
        <div  style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            // pointerEvents: 'none',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#fff',
            color: 'white',
            fontSize: '1.5rem',
          }}>
            
      {categories1.map((category, index) => (
        <Accordion key={index} expanded={expanded === `${category.name}`}
        onChange={handleChange(category)}>
          <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">

          <Stack direction={"row"} alignItems="center">
              {/* <BillerIcon categoryName={category} /> */}
              <Typography
                sx={{ textTransform: "capitalize" }}
                fontWeight="bold"
              >
                {category.name}
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
          <div
              style={{
                display: "flex",
                overflowY: "scroll",
                height: "7em",
              }}
            >
              <Grid container spacing={2}>
                {category.products.map((product) => (
                  <Grid item key={product.id}>
                    <div>
                      <Typography variant="subtitle1">{product.name}</Typography>
                      <img src={`https://sparkle-vortex.imgix.net/${product.id}.png?w=60&h=60`} alt={product.name} />
                    </div>
                  </Grid>
                ))}
              </Grid>           

          </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
            {/* accordion from material UI to show categories and inside is a horizontal scroller with products */}
            {/* <VortexBillerAccordionList
                  categories={categories}
                  billers={_billers}
                  onSelectCategory={(category) => {
                    _setCurrentSelectedCategory(category)
                  }}
                  onSelectBiller={(biller) => {
                    setCurrentSelectedCategory(_currentSelectedCategory)

                    setSelectedBiller(biller)
                    console.log(biller)
                  }}
                /> */}

        
      {/* </Container> */}
    </>
  );
}
