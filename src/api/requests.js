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

export {
  submitDataKyc,
  submitFileKyc
};