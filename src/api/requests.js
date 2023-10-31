import axios from 'axios';

const getNewToken = () => {
   return localStorage.getItem('token')
};

const getOnwerId = () =>{
    const userData = localStorage.getItem('user')
    const ownerId = JSON.parse(userData)
    return ownerId._id
}


// Create an Axios instance with default headers including the token
const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/v1/api/`,
  headers: {
    'Authorization': `Bearer ${getNewToken()}`
  }
});

const submitDataKyc = async (data) => {
  let response
  try {
    response = await axiosInstance.post(`kyc-business/${getOnwerId()}`, data);
  } catch (error) {
    console.error(error);
  }
  return response
};

const submitFileKyc = async (datas) =>{
    let response
    try{
        const formData = new FormData();

        datas.map((data) =>{
          return formData.append('file', data);
        }); 
        response = await axiosInstance.put(`kyc-business/kyc/${getOnwerId()}`, formData);
    }catch(error){
        console.log(error)
    }
    return response
}

const autocompleteAddress = async(data) =>{
  const config = {
    method: 'get',
    url: `https://api.geoapify.com/v1/geocode/autocomplete?text=${data}&apiKey=db811e8a257b4256a5965eb22e43f936`,
    headers: { }
  };

  const addressData =  await axios(config)
  if(addressData){
    return addressData;
  }
  return null;
}

const kycSubmittedStatus = async() =>{
  let response
  try{
    response = await axiosInstance.get(`kyc-business/store/${getOnwerId()}`)
  }catch(error){
    console.log(error)
  }
  return response
}

const getAllBanner = async() =>{
  let response
  try{
    response = await axiosInstance.get(`banner/all-active`)
  }catch(error){
    console.log(error)
  }
  return response
}

const getAllCustomers = async() =>{
  let response
  try{
    response = await axiosInstance.get(`customer/${getOnwerId()}`)
  }catch(error){
    console.log(error)
  }
  return response
}

export {
  submitDataKyc,
  submitFileKyc,
  autocompleteAddress,
  kycSubmittedStatus,
  getAllBanner,
  getAllCustomers
};