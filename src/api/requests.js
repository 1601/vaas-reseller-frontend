import axios from 'axios';

const getNewToken = () => {
   return localStorage.getItem('token')
};

const getOnwerId = () =>{
    const userData = localStorage.getItem('user')
    const ownerId = JSON.parse(userData)
    console.log(ownerId)
    return ownerId._id
}


// Create an Axios instance with default headers including the token
const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/v1/api/kyc-business/`,
  headers: {
    'Authorization': `Bearer ${getNewToken()}`
  }
});

const submitDataKyc = async (data) => {
  let response
  try {
    response = await axiosInstance.post(`${getOnwerId()}`, data);
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
        response = await axiosInstance.put(`kyc/${getOnwerId()}`, formData);
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
    response = await axiosInstance.get(`/store/${getOnwerId()}`)
  }catch(error){
    console.log(error)
  }
  return response
}
export {
  submitDataKyc,
  submitFileKyc,
  autocompleteAddress,
  kycSubmittedStatus
};