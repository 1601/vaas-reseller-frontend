import {
    getAllBanner, 
    getAllBannersAdmin, 
    addBanner,
    updateBannerStatus
} from '../requests'


export const allBanner = async() =>{
    return getAllBanner()
}
export const allBannersAdmin = async() =>{
    return getAllBannersAdmin()
}
export const submitBanner = async(data) =>{
    return addBanner(data)
}

export const bannerStatus = async(data) =>{
    return updateBannerStatus(data)
}