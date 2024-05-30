import {
    getAllBanner, 
    getAllBannersAdmin, 
    addBanner,
    updateBannerStatus,
    updateBanner
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

export const updateEditBanner = async(data, id) =>{ 
    return updateBanner(data, id)
}

export const bannerStatus = async(data) =>{
    return updateBannerStatus(data)
}