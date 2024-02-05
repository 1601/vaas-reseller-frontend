import axios from 'axios';
import SecureLS from 'secure-ls';

const ls = new SecureLS({ encodingType: 'aes' });

const getNewToken = () => {
  return ls.get('token');
};

const getOwnerId = () => {
  const userData = ls.get('user'); 
  return userData ? userData._id : null; 
};

// Create an Axios instance with default headers including the token
const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/v1/api/`,
  headers: {
    Authorization: `Bearer ${getNewToken()}`,
  },
});

const submitDataKyc = async (data) => {
  let response;
  try {
    response = await axiosInstance.post(`kyc-business/${getOwnerId()}`, data);
  } catch (error) {
    console.error(error);
  }
  return response;
};

const submitFileKyc = async (datas) => {
  let response;
  try {
    const formData = new FormData();

    datas.map((data) => {
      return formData.append('file', data);
    });
    response = await axiosInstance.put(`kyc-business/kyc/${getOwnerId()}`, formData);
  } catch (error) {
    console.log(error);
  }
  return response;
};

const autocompleteAddress = async (data) => {
  const config = {
    method: 'get',
    url: `https://api.geoapify.com/v1/geocode/autocomplete?text=${data}&apiKey=db811e8a257b4256a5965eb22e43f936`,
    headers: {},
  };

  const addressData = await axios(config);
  if (addressData) {
    return addressData;
  }
  return null;
};

const kycSubmittedStatus = async () => {
  let response;
  try {
    response = await axiosInstance.get(`kyc-business/store/${getOwnerId()}`);
  } catch (error) {
    console.log(error);
  }
  return response;
};

const addBanner = async (data) => {
  let response;
  try {
    const bannerDetails = {
      title: data.title,
      description: data.description,
    };
    response = await axiosInstance.post('banner', bannerDetails);
    if (response) {
      const formData = new FormData();
      formData.append('file', data.image);

      const imageResult = await axiosInstance.put(`banner/banner/${response.data.body._id}`, formData);
      if (imageResult) {
        console.log(imageResult);
      } else {
        console.log(imageResult);
      }
    }
  } catch (error) {
    console.log(error);
  }
  return response;
};

const updateBannerStatus = async (data) => {
  let response;
  try {
    const { idBanner, status } = data;
    response = await axiosInstance.put(`banner/status/${idBanner}/${status}`);
    if (response) {
      return response;
    }
  } catch (error) {
    console.log(error);
  }
  return response;
};

const getAllBanner = async () => {
  let response;
  try {
    response = await axiosInstance.get(`banner/all-active`);
  } catch (error) {
    console.log(error);
  }
  return response;
};

const getAllBannersAdmin = async () => {
  let response;
  try {
    response = await axiosInstance.get(`banners/admin`);
  } catch (error) {
    console.log(error);
  }
  return response;
};

const getAllCustomers = async () => {
  let response;
  try {
    response = await axiosInstance.get(`customer/${getOwnerId()}`);
  } catch (error) {
    console.log(error);
  }
  return response;
};

export {
  submitDataKyc,
  submitFileKyc,
  autocompleteAddress,
  kycSubmittedStatus,
  getAllBanner,
  getAllBannersAdmin,
  getAllCustomers,
  addBanner,
  updateBannerStatus,
};
