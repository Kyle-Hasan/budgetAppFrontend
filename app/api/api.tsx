import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import { getStorageValue } from "../storage/storage";

const baseURL = process.env.EXPO_PUBLIC_API_URL;


const api:AxiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type':'Application/json'
    }
})

axios.interceptors.request.use( (config) => {
    //add token logic
    if(config.url && !config.url.includes('/login') && !config.url.includes('/signup') ) {
    config.headers.Authorization = `Bearer ${getStorageValue('accessToken')}`
    }
    return config;
  }, function (error) {
   
    return Promise.reject(error);
  });


  const authApi = {
        login:(credentials: {username:string, password:string}) => {
            return axios.post(baseURL+'/api/users/login',credentials,  {
                headers: {
                    'Content-Type':'Application/json'
                }
            })
        },

        signup:(signupData: {email:string, username:string, password:string}) => {
            return axios.post(baseURL+'/api/users/signup',signupData,  {
                headers: {
                    'Content-Type':'Application/json'
                }
            })
        }
  }

  export {authApi}
  export default api