import axios from 'axios';
import SecureLS from 'secure-ls';
import ApprovalLoadingStates from '../components/loading/ApprovalLoadingStates';

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
    response = await axiosInstance.post(`kyc-business/${getOwnerId()}`, data, {
      headers: { Authorization: `Bearer ${getNewToken()}`, },
    });
  } catch (error) {
    console.error(error);
  }
  return response;
};

const submitFileKyc = async (datas, type='none') => {
  let response;
  try {
    const formData = new FormData();

    datas.map((data) => {
      return formData.append('file', data);
    });
    if(type === 'docOthers'){
      response = await axiosInstance.put(`kyc-business/kyc2/upload`, formData, {
        headers: { Authorization: `Bearer ${getNewToken()}`, },
      });
    }else{
      response = await axiosInstance.put(`kyc-business/kyc/upload`, formData, {
        headers: { Authorization: `Bearer ${getNewToken()}`, },
      });
    }
  } catch (error) {
    console.log(error.response);
    throw error.response
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
  try {
    const token = ls.get('token');
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/owner`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response && response.data) {
      return response.data;
    }
    console.error('No data returned from API');
    return null;
  } catch (error) {
    console.error('Failed to fetch KYC status:', error.response ? error.response.data : error);
    return null;
  }
};

const addBanner = async (data) => {
  let response;
  try {
    const bannerDetails = {
      title: data.title,
      description: data.description,
    };

    if (!data.image) {
      alert("No files found");
      return null;
    }

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


const updateBanner = async (data, id) => {
  let response;
  try {
    const formData = new FormData();
    if (data.title) {
      formData.append('title', data.title);
    }
    if (data.description) {
      formData.append('description', data.description);
    }
    if (data.image) {
      formData.append('file', data.image);
    }

    response = await axiosInstance.put(`banner/banner/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${getNewToken()}`,
      },
    });
  } catch (error) {
    console.log(error);
  }
  return response;
};


const updateBannerStatus = async (data) => {
  let response;
  try {
    const { idBanner, status } = data;
    response = await axiosInstance.put(
      `banner/status/${idBanner}/${status}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getNewToken()}`,
        },
      }
    );
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
    const token = getNewToken();
    response = await axiosInstance.get('banners/admin', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
  updateBanner,
};
