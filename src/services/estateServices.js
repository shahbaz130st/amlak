import * as Common from '../common/index';
import * as Constants from '../constants/index';

const cityList = async () => {
  try {
    const response = await Common.axios.get(Constants.API.Dashboard.CITIES);

    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        return response.data.data;
      } else {
        return response.data;
      }
    }
  } catch (error) {
    console.log('error------>', error);

    return null;
  }
};

const estates = async (estateID) => {
  console.log(Constants.API.Dashboard.ESTATES_DETAIL + `${estateID}`)
  try {
    const response = await Common.axios.get(
      Constants.API.Dashboard.ESTATES_DETAIL + `${estateID}`,
    );

    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        return response.data.data;
      } else {
        return response.data;
      }
    }
  } catch (error) {
    console.log('error------>', error);
    return null;
  }
};

const searchEstatesByArea = async (data) => {
  try {
    const body = {
      city: data.city,
      area: data.area,
    };
    console.log('Request------>', body);
    const response = await Common.axios.post(
      Constants.API.Dashboard.ESTATES_SEACRH_AREA,
      body,
    );
    if (response && response.status == 200) {
      if (response.data && response.data.access_token) {
      }
      return response.data;
    }
  } catch (error) {
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return error.message;
  }
};

const categories = async () => {
  try {
    const response = await Common.axios.get(Constants.API.Dashboard.CATEGORIES);

    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        console.log(response.data.data);
        return response.data.data;
      } else {
        return response.data;
      }
    }
  } catch (error) {
    console.log('error------>', error);
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return null;
  }
};
const addToFav = async (estateID) => {
  try {
    const response = await Common.axios.get(
      Constants.API.Dashboard.ADD_TO_FAV + `${estateID}`,
    );
    console.log(response);

    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        return response.data.status;
      } else {
        return response.data;
      }
    }
  } catch (error) {
    console.log('error------>', error);
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return null;
  }
};

const filterEstates = async (data) => {
  try {
    const body = {
      rent_or_sale: data.city,
      price: data.area,
      no_of_beds: data.no_of_beds,
      no_of_path: data.no_of_beds,
      no_of_path: data.no_of_beds,
      no_of_floor: data.no_of_floor,
      address: data.address,
      city_id: data.city_id,
    };
    const response = await Common.axios.post(
      Constants.API.Dashboard.ESTATES_SEACRH_AREA,
      body,
    );
    if (response && response.status == 200) {
      if (response.data && response.data.access_token) {
      }
      return response.data;
    }
  } catch (error) {
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return error.message;
  }
};
const homeSearch = async (keyword) => {
  try {
    const body = {
      key_words: keyword,
    };
    console.log('homeSearch body', body)
    const response = await Common.axios.post(
      Constants.API.Dashboard.HOME_SEARCH,
      body,
    );
    console.log('home/Searchresponse ', response)
    if (response && response.status == 200) {
      return response.data.data;
    }
  } catch (error) {
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return error.message;
  }
};
const defaultEstates = async (data) => {
  try {
    const body = {
      latitude: data.latitude,
      longitude: data.longitude,
      zoom: data.zoom,
      city_id: data.city_id
    };
    console.log("urlasd", `${Constants.API.Dashboard.ESTATES_SEACRH}/page=${data.page}`)
    console.log("urlasd=====data", data, body)
    const response = await Common.axios.post(
      `${Constants.API.Dashboard.ESTATES_SEACRH}?page=${data.page}`,
      body,
    );
    if (response && response.status == 200) {
      if (response.data && response.data.access_token) {
      }
      return response.data;
    }
  } catch (error) {
    // setTimeout(function () {
    //   Common.Alert.show('alert', error.message);
    // }, 2000);
    console.log('error--', error);

    return error.message;
  }
};
const priceRange = async (data) => {
  try {
    const body = {
      category_id: data.category_id,
      rent_or_sale: data.rent_or_sale,
    };
    const response = await Common.axios.post(
      Constants.API.Dashboard.PRICE_MAX_MIN,
      body,
    );
    if (response && response.status == 200) {
      if (response.data && response.data.access_token) {
      }
      return response.data;
    }
  } catch (error) {
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return error.message;
  }
};

const sortList = async (data) => {
  console.log("Api url", Constants.API.Dashboard.ESTATES_SORT, data)
  try {
    // const body = {
    //   starts: data.starts,
    //   number_of_halls: data.number_of_halls,
    //   number_of_baths: data.number_of_baths,
    //   number_of_rooms: data.number_of_rooms,
    //   min_price: data.min_price,
    //   max_price: data.max_price,
    //   rent_or_sale: data.rent_or_sale,
    //   type: data.type,
    //   elevator:data.elevator,
    //   electricity:data.electricity,
    //   car_garage:data.car_garage,
    //   water:data.water
    // };
    const response = await Common.axios.post(
      Constants.API.Dashboard.ESTATES_SORT,
      data,
    );

    if (response && response.status == 200) {
      return response.data;
    }
  } catch (error) {
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return error.message;
  }
};
const addEstates = async (data) => {
  try {
    const response = await Common.axios.post(
      Constants.API.Dashboard.ADD_ESTATE,
      data,
    );
    console.log('Add Estates----->', response);
    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        return response.data
      } else {
        setTimeout(function () {
          Common.Alert.show('alert', `${JSON.stringify(response.data.errors)}`);
        }, 2000);
        return null;
      }
    }
  } catch (error) {
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return null;
  }
};
const report = async (data) => {
  try {
    const body = {
      user_id: data.user_id,
      estat_id: data.estat_id,
      comment: data.comment,
      value: data.value,
    };
    const response = await Common.axios.post(
      Constants.API.Dashboard.REPORT_ESTATE,
      body,
    );
    console.log('report---->', response);
    if (response && response.status == 200) {
      return response.data;
    }
  } catch (error) {
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return error.message;
  }
};
const postReview = async (data) => {
  try {
    const body = {
      user_id: data.user_id,
      //  estat_id:data.estat_id,
      comment: data.comment,
      value: data.value,
      user_name: data.user_name,
    };
    console.log("Post review", body)
    const response = await Common.axios.post(
      Constants.API.Dashboard.POST_REVIEW,
      body,
    );

    if (response && response.status == 200) {
      return response.data;
    }
  } catch (error) {
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return error.message;
  }
};

const rePost = async (estateID) => {
  try {
    const response = await Common.axios.get(
      Constants.API.Dashboard.REPOST + `${estateID}`,
    );

    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        console.log(response.data.data);
        return response.data.data;
      } else {
        return response.data;
      }
    }
  } catch (error) {
    console.log('error------>', error);
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return null;
  }
};

const deletePost = async (estateID) => {
  try {
    const response = await Common.axios.get(
      Constants.API.Dashboard.DELETE_POST + `${estateID}`,
    );

    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        console.log(response.data.data);
        return response.data.data;
      } else {
        return response.data;
      }
    }
  } catch (error) {
    console.log('error------>', error);
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return null;
  }
};

const myAds = async () => {
  try {
    const response = await Common.axios.get(Constants.API.Dashboard.GET_MY_ADS);

    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        console.log(response.data.data);
        return response.data.data;
      } else {
        return response.data;
      }
    }
  } catch (error) {
    console.log('error------>', error);
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return null;
  }
};

const similarAds = async (estateID) => {
  try {
    const response = await Common.axios.get(
      Constants.API.Dashboard.SIMILER_ADS + `${estateID}`,
    );

    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        console.log(response.data.data);
        return response.data.data;
      } else {
        return response.data;
      }
    }
  } catch (error) {
    console.log('error------>', error);
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return null;
  }
};

const similarProps = async (estateID) => {
  try {
    const response = await Common.axios.get(
      Constants.API.Dashboard.SIMILER_ADS + `${estateID}`,
    );
    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        console.log(response.data.data);
        return response.data.data;
      } else {
        return response.data;
      }
    }
  } catch (error) {
    console.log('error------>', error);
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return null;
  }
};
//    "DELETE_POST":"estates/delete/",

const deletefav = async (favID) => {
  try {
    const response = await Common.axios.get(
      Constants.API.Dashboard.DELETE_ESTATE_FAV + `${favID}`,
    );

    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        console.log(response.data);
        return response.data;
      } else {
        return response.data;
      }
    }
  } catch (error) {
    console.log('error------>', error);
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return null;
  }
};

const propertyByCity = async (id) => {
  try {
    const response = await Common.axios.get(Constants.API.Dashboard.PROPERTY_BY_CITY + id);

    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        return response.data.data;
      } else {
        return response.data;
      }
    }
  } catch (error) {
    console.log('error------>', error);

    return null;
  }
};

export default {
  cityList,
  estates,
  searchEstatesByArea,
  categories,
  addToFav,
  filterEstates,
  homeSearch,
  defaultEstates,
  priceRange,
  sortList,
  report,
  rePost,
  deletePost,
  myAds,
  postReview,
  similarAds,
  addEstates,
  deletefav,
  similarProps,
  propertyByCity
};
