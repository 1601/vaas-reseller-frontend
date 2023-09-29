export default function localTelecomRankProvider(telecom) {
  switch (telecom) {
    case "SMARTPH":
      return 6
    case "TNTPH":
      return 5
    case "PLDTPH":
      return 4
    case "GLOBE":
      return 3
    case "MERALCO":
      return 2
    case "CIGNAL":
      return 1
    case "ROW":
      return 0

      //this is for the bills payment
    case 'SMART Broadband':
      return 100
    case 'PLDT':
      return 99
    case 'Globe At Home': 
      return 98
    case 'Globe Postpaid':
      return 97
    case 'Digitel Communications':
      return 96
    case 'ABSMOBILE':
      return 95
    case 'Bayantel':
      return 94

    default: 
      return 0
  }
}
