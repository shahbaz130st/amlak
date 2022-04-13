import AsyncStorage from '@react-native-community/async-storage';

const save = async (key, value) => {
    try {
  
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  const get = async (key) => {
    try {
      const value = JSON.parse(await AsyncStorage.getItem(key));
      return value;
    } catch (error) {
      console.log(error)
      return false;
    }
  }
  
  const remove = async (key) => {
    try {
      const value = await AsyncStorage.removeItem(key);
      return value;
    } catch (error) {
      return false;
    }
  }
  
  export default {
    save,
    get,
    remove
  }