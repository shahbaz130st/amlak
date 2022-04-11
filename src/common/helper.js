import { Platform,Dimensions } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob'
import GetLocation from 'react-native-get-location'
import Geocoder from 'react-native-geocoder';
import analytics from '@react-native-firebase/analytics';

const isAndroid = () => {
  console.log('plat---->',Platform.OS)
    return Platform.OS == "android"
  }

  const address = async(latitude,longitude) => {
    Geocoder.fallbackToGoogle("AIzaSyDuig9JF6G0maKvfO_hHC1mLzuupz6Zj4E");
    console.log(latitude);
    try {
      let data = await Geocoder.geocodePosition({lat:latitude,lng:longitude})
      if (data && data[0])  {
        console.log(data[0])
        return(data[0])
      }
    } catch (error) {
      console.log(error);

      return 'Invalid location'
    }
  
  }

  const logEvent = async(name,obj) => {
    await analytics().logEvent(name, obj)
  }

  const dimensions = () => {
    return  Dimensions.get('window');
  }
  const filePath = async(path) => {
    let data = await RNFetchBlob.fs.readFile(path,"base64")
    if (data) {
      console.log(data);
    }
  }

  const location = async() => {
    let data = await GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
  });
  return  data;
  }
  const  sign = (type) => {
    if (type == 'USD') {
      return '$ ';
    } else if (type == 'JOD') {
      return 'د.ا ';
    } else {
      return '₪ ';
    }
  };
  const  capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  export default {
    isAndroid,
    filePath,
    dimensions,
    location,
    sign,
    address,
    capitalize,
    logEvent
  }