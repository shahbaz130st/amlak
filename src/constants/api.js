// const BaseURL = "http://amlakps.herokuapp.com/api/";
const BaseURL = 'http://3.14.19.113/property/public/api/';
const Token = null;
const FirebaseToken = null;
const Language = 'ar';
// const ImageBaseURL = 'http://amlakps.herokuapp.com/assets/upload/'

// const ImageBaseURL = 'http://3.138.34.181/property/assets/upload/'

const ImageBaseURL = (ID) => {
  return `https://drive.google.com/uc?id=${ID}&export=media`
}


const Onboarding = {
  LOGIN: 'auth/login',
  SIGNUP: 'auth/register',
  USER_DATA: 'user/all-data',
  ACTIVATE_USER: 'auth/activate-user',
  USER_COORDINATE: 'user/set-coordinates',
  PAYMENT_METHOD: 'user/set-payment-method',
  RATING: 'user/post-review',
};
const Dashboard = {
  CITIES: 'cities',
  ESTATES_SEACRH: 'estates/search',
  ESTATES_SEACRH_AREA: 'estates/search-by-area',
  ESTATES_DETAIL: 'estates/',
  ESTATES_CATEGORY: 'estates/by-category/',
  CATEGORIES: 'categories',
  ADD_TO_FAV: 'estates/add-to-fav/',
  ESTATES_FILTER: 'estates/filter?',
  HOME_SEARCH: 'estates/advance-search',
  PRICE_MAX_MIN: 'estates/price-range',
  ESTATES_SORT: 'estates/sort-result',
  ADD_ESTATE: 'user/estate',
  REPORT_ESTATE: 'user/post-report',
  REPOST: 'estates/re-publish/',
  DELETE_POST: 'estates/delete/',
  UPDATE_PROFILE: 'auth/update-user',
  GET_MY_ADS: 'user/get-my-ads',
  POST_REVIEW: 'user/post-review',
  SIMILER_ADS: 'estates/similar-estate/',
  DELETE_ESTATE_FAV: 'estates/delete-fav/',
  SIMILER_EST: 'estates/similar-estate/',
  PROPERTY_BY_CITY: 'estates/by-city/'

};

const User = {
  USER_INFORMATION: 'user/user-info/',
  SET_DEVICE_INFO: 'user/set-device-info',
};

//estates/by-category/
export default {
  BaseURL,
  Onboarding,
  Dashboard,
  Token,
  ImageBaseURL,
  Language,
  User,
  FirebaseToken
};
