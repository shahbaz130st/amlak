import { Alert } from 'react-native';
import Translations from './translations';
const show = (title, message, confirmation) => {
  let buttons = [
    {
      text: Translations.translate('ok'),
      onPress: () => { console.log('done...') }
    }
  ]

  if (confirmation) {
    buttons = [
      {
        text: 'Yes',
        onPress: () => { confirmation.onClick(confirmation.yes) }
      },
      {
        text: 'No',
        onPress: () => { confirmation.onClick(confirmation.no) }
      }
    ]
  }

  Alert.alert(Translations.translate(title), message, buttons, { cancelable: false });
};

export default {
  show
}