import axios, {AxiosInstance, AxiosRequestConfig} from "axios";

const api:AxiosInstance = axios.create({
    baseURL: '',
    headers: {
        'Content-Type':'Application/json'
    }
})

axios.interceptors.request.use( (config) => {
    
    return config;
  }, function (error) {
   
    return Promise.reject(error);
  });


  const authApi = {
        login:(credentials: {username:string, password:string}) => {
            return axios.post('',credentials,  {
                headers: {
                    'Content-Type':'Application/json'
                }
            })
        },

        signup:(signupData: {email:string, username:string, password:string}) => {
            return axios.post('',signupData,  {
                headers: {
                    'Content-Type':'Application/json'
                }
            })
        }
  }

  export {authApi}
  export default api