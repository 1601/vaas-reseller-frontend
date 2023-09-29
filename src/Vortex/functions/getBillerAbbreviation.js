export default function getBillerAbbreviation(biller) {
  let { name } = biller
  let abbreviation = name

  switch (name) {
    case "ISABELA 1 ELECTRIC COOPERATIVE INC. (ISELCO I)":
      abbreviation = "ISELCO I"
      break
    case "NORTHERN NEGROS ELETRIC COOPERATIVE (NONEO)":
      abbreviation = "NONEO"
      break
    case "TARLAC I ELETRIC COOPERATIVE, INC. (TARELCO I)":
      abbreviation = "TARELCO I"
      break
    case "Batangas 2 Electric Cooperative Inc. (BATELEC2)":
      abbreviation = "BATELEC2"
      break
    case "Benguet Electric Coop (BENECO)":
      abbreviation = "BENECO"
      break
    case "Camarines Sur II Electric Cooperative(CASURECO2)":
      abbreviation = "CASURECO2"
      break
    case "Cebu II Electric Cooperative (CEBECO2)":
      abbreviation = "CEBEC02"
      break
    case "Ilocos Sur Electric Cooperative, Inc.(ISECO)":
      abbreviation = "ISECO"
      break
    case "OLONGAPO ELECTRICITY DISTRIBUTION COMPANY INC. (OEDC)":
      abbreviation = "OEDC"
      break
    case "Pampanga 1 Elec Coop. Inc. (PELCO1)":
      abbreviation = "PELCO1"
      break
    case "Pampanga Rural Electric Service Coop. (PRESCO)":
      abbreviation = "PRESCO"
      break
    case "SORSOGON II ELECTRIC COOPERATIVE, INC (SORECO II)":
      abbreviation = "SORECO II"
      break
    case "Maritime Industry Authority":
      abbreviation = "MARINA"
      break
    case "PNP License To Own and Possess Firearm (LTOPF)":
      abbreviation = "LTOPF"
      break
    case "National Bureau of Investigation (NBI)":
      abbreviation = "NBI"
      break
    case "National Housing Authority (NHA)":
      abbreviation = "NHA"
      break
    case "Bacolod City Water District":
      abbreviation = "BACIWA"
      break
    case "Baliwag Water District":
      abbreviation = "BWA"
      break
    case "CAGAYAN DE ORO WATER (COWD)":
      abbreviation = "COWD"
      break
    case "Happy Well Management and Collection Services Inc":
      abbreviation = "Happy Well PH"
      break
    case "LAGUNA WATER DISTRICT AQUATECH RESOURCES CORP.":
      abbreviation = "LARC"
      break
    case "Maynilad Water Services Inc.":
      abbreviation = "Maynilad"
      break
    case "Sta. Maria Water District (SMWD)":
      abbreviation = "SMWD"
      break
    case "Tabaco Water (TAWAD)":
      abbreviation = "TAWAD"
      break
  }

  console.log(biller)
  return {...biller, name: abbreviation} 
}
