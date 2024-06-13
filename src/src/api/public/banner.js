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

export const submitBanner = async (data, setLoading) => {
    return addBanner(data, setLoading);
};
  
  export const updateEditBanner = async (data, id, setLoading) => {
    return updateBanner(data, id, setLoading);
};
  
  export const bannerStatus = async (data, setLoading) => {
    return updateBannerStatus(data, setLoading);
};