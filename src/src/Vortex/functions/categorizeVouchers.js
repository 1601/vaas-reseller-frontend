let resultBuffer = ""
let result = {}
let vouchersList = {}
let allVouchers = []

export function categorizeVouchers(vouchers) {
  vouchers.forEach((voucher) => {
    let name = voucher.name
      .split(" P")[0]
      .toLowerCase()
      .replaceAll("'", "")
      .replaceAll(`"`, "")

    let category = getVoucherCategory(name)

    //if already in teh buffer, disregard
    if (brandAlreadyIncluded(name)) {
    } else saveBrandToCategory(voucher, category)

    saveBrandAndCategoryToList(voucher, category)
  })

  return {
    brandCategories: brandCategories(result),
    voucherList: voucherList(vouchersList),
  }
}

export function getAllVouchers(data) {
  // console.log("getting all vouchers here")
  if (allVouchers.length === 0) {
    let result = []
    for (let i = 0; i < data.length; i++) {
      if (data[i].brand === "GIFT") result.push(data[i])
    }

    allVouchers = result
    return result
  }
  return allVouchers
}

export function searchVouchersByKeyword(keyword) {
  let searchKey = keyword.toLowerCase()
  // console.log("searching vouchers by keyword", keyword)
  let result = []

  for (let a = 0; a < allVouchers.length; a++) {
    if (allVouchers[a].name.toLowerCase().includes(searchKey))
      result.push(allVouchers[a])
  }

  return result
}

export function categorizeSearchResult(vouchers) {
  let result = {}
  let searchResultBuffer = ""
  let resultList = {} 
  vouchers.forEach((voucher) => {
    let name = voucher.name
      .split(" P")[0]
      .toLowerCase()
      .replaceAll("'", "")
      .replaceAll(`"`, "")
    let category = getVoucherCategory(name)

    let { data, status } = searchingBrandAlreadyIncluded(
      searchResultBuffer,
      name
    )
    searchResultBuffer = data
    //brand already included
    if (status) {
    } else {
      result = searchingSaveBrandToCategory(result, voucher, category)
    }

    // console.log(resultList)
    resultList = searchingSaveBrandAndCategoryToList(resultList, voucher, category)
  })


  return {
    brandCategories: brandCategories(result), 
    voucherList: voucherList(resultList)
  }
}

function searchingBrandAlreadyIncluded(obj, brand) {
  if (obj.includes(brand)) {
    return {
      data: obj,
      status: true,
    }
  } else {
    return {
      data: `${obj}${brand} `,
      status: false,
    }
  }
}

function searchingSaveBrandToCategory(obj, voucher, category) {
  let data = { name: voucher.name.split(" P")[0], firstProduct: voucher.name }

  if (!obj?.[`${category}`]) {
    obj[`${category}`] = [data]
  } else {
    obj[`${category}`].push(data)
  }

  return obj
}

function searchingSaveBrandAndCategoryToList(obj, voucher, category) {
  if (!obj?.[`${category}`]) {
    obj[`${category}`] = [voucher]
  } else {
    obj[`${category}`].push(voucher)
  }

  return obj
}

function brandCategories(data) {
  return Object.keys(data).map((key) => {
    let brands = data[key]
    return {
      c: key,
      brands: brands,
    }
  })
}

function voucherList(data) {
  return Object.keys(data).map((key) => {
    let tempBrands = data[key]

    let brands = removeDuplicateVoucher(tempBrands)
    return {
      categoryheader: key,
      products: brands,
    }
  })
}

//This will remove any duplicate voucher on the list
function removeDuplicateVoucher(vouchers) {
  let finalList = []
  for (let index = 0; index < vouchers.length; index++) {
    if (!finalList.includes(vouchers[index])) {
      finalList.push(vouchers[index])
    }
  }

  return finalList
}

function brandAlreadyIncluded(brand) {
  if (resultBuffer.includes(brand)) {
    return true
  } else {
    resultBuffer = `${resultBuffer}${brand}`
    return false
  }
}

function saveBrandToCategory(brand, category) {
  let data = { name: brand.name.split(" P")[0], firstProduct: brand.name }

  if (!result?.[`${category}`]) {
    result[`${category}`] = [data]
  } else {
    result[`${category}`].push(data)
  }
}

function saveBrandAndCategoryToList(voucher, category) {
  if (!vouchersList?.[`${category}`]) {
    vouchersList[`${category}`] = [voucher]
  } else {
    vouchersList[`${category}`].push(voucher)
  }
}

function getVoucherCategory(voucher) {
  let category = "food"
  switch (voucher) {
    case "daiso japan":
    case "landmark":
    case "lazada":
    case "robinsons department store":
    case "shopee":
    case "rustans department store":
    case "the sm store":
    case "sm gift":
    case "metro supermarket":
    case "puregold":
    case "robinsons supermarket":
    case "robinsons":
      category = "Shopping"
      break
    case "fully booked":
    case "national book store":
    case "powerbooks":
      category = "Bookstore"
      break
    case "handyman":
    case "true value":
      category = "Hardware"
      break
    case "bratpack":
    case "jansport":
    case "herschel":
    case "r.o.x.":
    case "the travel club":
    case "beautymnl":
    case "owndays":
    case "sunglass haven":
      category = "Lifestyle"
      break
    case "ansons":
    case "automatic centre":
    case "digital walker":
    case "robinsons appliances":
      category = "Home Appliances"
      break
    case "cmi botika":
    case "vision express":
      category = "Medical"
      break
    case "my baby":
    case "toysrus":
      category = "Kids"
      break
    case "8cuts burgers":
    case "auntie annes":
    case "baskin robbins":
    case "bench cafe":
    case "black canyon coffee":
    case "bonchon":
    case "bos coffee":
    case "buffalo wild wings":
    case "bulgogi brothers":
    case "candy corner":
    case "chatime":
    case "chilis":
    case "churreria la lola":
    case "cinnabon":
    case "dencios bar and grill":
    case "dennys":
    case "din tai fung":
    case "fat fook":
    case "fish and co.":
    case "gelatissimo":
    case "gong cha":
    case "ippudo":
    case "italiannis":
    case "jamba juice":
    case "jollibee":
    case "kabisera":
    case "krispy kreme":
    case "manam":
    case "maxs":
    case "mesa filipino moderne":
    case "nonos":
    case "ooma":
    case "outback steakhouse":
    case "pancake house":
    case "papa johns":
    case "pepi cubano":
    case "red ribbon":
    case "royce":
    case "saladstop!":
    case "t.g.i. fridays":
    case "teriyaki boy":
    case "texas roadhouse":
    case "the bistro group":
    case "the coffee bean & tea leaf":
    case "the moment group":
    case "tim ho wan":
    case "tokyo tonteki":
    case "tuantuan chinese brasserie":
    case "watami":
    case "wee nam kee":
    case "wildflour cafe & bakery":
    case "yabu":
    case "yellow cab":
    case "yoshinoya":
      category = "Food"
      break
  }

  return category
}
