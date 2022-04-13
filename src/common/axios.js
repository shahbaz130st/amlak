import Axios from 'axios';
import API from '../constants/api';
import KeyChain from './keychain'
const CancelToken = Axios.CancelToken;
export let cancel;

const token = async() => {
let key = await KeyChain.get('authToken');
  return key;
};

const language = () => {
  return API.Language;
};

export const axios = Axios.create({
  baseURL: API.BaseURL,
  timeout: 120000,
  responseType: 'json',
  cancelToken: new CancelToken((c) => {
    cancel = c;
  }),
});

// Request interceptor
 axios.interceptors.request.use(
  (config) => {
    if (API.Token != null) {
      config.headers = {
        Authorization: 'bearer '+ API.Token,
        Accept: 'application/json',
        'Accept-Language': `${language()}`,
        'Content-Type': 'application/json',
      };
      return config;
    } else {
      config.headers = {
        'Accept-Language': `${language()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      return config;
    }
  },
  (error) => {
    console.log('error----->',error.message);
    return Promise.resolve(error);
  },
);

// Response interceptor
axios.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error) => {
    console.log('response error----->',error);
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
  }
  return Promise.reject(error.message);
  },
);
