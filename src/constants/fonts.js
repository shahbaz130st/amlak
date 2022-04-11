import { Platform } from 'react-native';
export default (() => {
  if (Platform.OS == 'ios') {
    return {
      shamel: 'FFShamelFamily-SansOneBook',
      shamelBold: 'FFShamelFamily-SansOneBold',
      SF_Display_Bold: 'SFProDisplay-Bold',
      SF_Display_Semi_Bold: 'SFProDisplay-Semibold',
      SF_Pro_Text_Bold: 'SFProText-Bold',
      SF_Pro_Text_Medium: 'SFProText-Medium',
      SF_Pro_Text_Regular: 'SFProText-Regular',
      SF_Pro_Text_Semibold: 'SFProText-Semibold'
    }
  } else if (Platform.OS == 'android') {
    return {
      shamel: 'FF-Shamel-Family-Sans-One-Book',
      shamelBold: 'ArbFONTS-FFShamelFamily-SansOneBold',
      SF_Display_Bold: 'SF-Pro-Display-Bold',
      SF_Display_Semi_Bold: 'SF Pro Display Semibold',
      SF_Pro_Text_Bold: 'SF Pro Text Bold',
      SF_Pro_Text_Medium: 'SF Pro Text Medium',
      SF_Pro_Text_Regular: 'SF Pro Text Regular',
      SF_Pro_Text_Semibold: 'SF Pro Text Semibold'
    }
  }
}
)();

