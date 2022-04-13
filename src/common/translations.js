import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import {I18nManager} from 'react-native';
import KeyChain from './keychain';
import * as Constants from '../constants/index';
import AsyncStorage from '@react-native-community/async-storage';

const translationGetters = {
  'en-US': () => require('../assets/translations/en.json'),
  en: () => require('../assets/translations/en.json'),
  ar: () => require('../assets/translations/ar.json'),
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

const initConfig = async(landuage) => {
  let lang = await AsyncStorage.getItem('Language');
  if (lang){
    console.log('Language--------->',lang);
    Constants.API.Language = lang;
  }

  const fallback = {languageTag: landuage == null ? Constants.API.Language : landuage};
  // KeyChain.save('language', landuage == null ? 'ar' : landuage);
  Constants.API.Language = landuage == null ? Constants.API.Language : landuage;
  console.log('set-------->', Constants.API.Language );
  // const { languageTag } =
  //   RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
  //   fallback
  const {languageTag} = fallback;
  translate.cache.clear();
  i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  i18n.locale = languageTag;
};
export default {
  translate,
  initConfig,
};
