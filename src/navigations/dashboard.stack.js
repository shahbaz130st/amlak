import React from 'react';
import {View, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as Screens from '../screens/index';
import * as Constants from '../constants/index';
import * as Common from '../common/index';

const Tab = createBottomTabNavigator();

const DashboardStack = () => (
  <Tab.Navigator
    initialRouteName={Common.Translations.translate(
      Constants.Navigations.Dashboard.MAIN,
    )}
    screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName;
        if (
          route.name ===
          Common.Translations.translate(Constants.Navigations.Dashboard.MAIN)
        ) {
          iconName = focused
            ? Constants.Images.mainSelected
            : Constants.Images.main;
        } else if (
          route.name ===
            Common.Translations.translate(
              Constants.Navigations.Dashboard.PROVINCES,
            ) &&
          Constants.API.Token != null
        ) {
          iconName = focused
            ? Constants.Images.provincesSelected
            : Constants.Images.provinces;
        } else if (route.name === Constants.Navigations.Dashboard.AddNEW) {
          iconName = focused ? Constants.Images.plus : Constants.Images.plus;
        } else if (
          route.name ===
            Common.Translations.translate(
              Constants.Navigations.Dashboard.FAVORITE,
            ) &&
          Constants.API.Token != null
        ) {
          iconName = focused
            ? Constants.Images.favoriteSelected
            : Constants.Images.favorite;
        } else if (
          route.name ===
          Common.Translations.translate(Constants.Navigations.Dashboard.MORE)
        ) {
          iconName = focused
            ? Constants.Images.moreSelected
            : Constants.Images.more;
        }

        // You can return any component that you like here!
        return route.name != Constants.Navigations.Dashboard.AddNEW ? (
          <Image source={iconName} />
        ) : (
          <View
            style={{
              marginTop: 15,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#006FEB',
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image source={iconName} />
          </View>
        );
      },
    })}
    tabBarOptions={{
      activeTintColor: '#006FEB',
      inactiveTintColor: '#989898',
    }}>
    <Tab.Screen
      name={Common.Translations.translate(Constants.Navigations.Dashboard.MORE)}
      component={Screens.More}
    />
    {Constants.API.Token != null && (
      <Tab.Screen
        name={Common.Translations.translate(
          Constants.Navigations.Dashboard.FAVORITE,
        )}
        component={Screens.Favorite}
      />
    )}

    <Tab.Screen
      options={{tabBarLabel: ''}}
      name={Constants.Navigations.Dashboard.AddNEW}
      component={Screens.AddNew}
    />
    {Constants.API.Token != null && (
      <Tab.Screen
        name={Common.Translations.translate(
          Constants.Navigations.Dashboard.PROVINCES,
        )}
        component={Screens.Provinces}
      />
    )}

    <Tab.Screen
      name={Common.Translations.translate(Constants.Navigations.Dashboard.MAIN)}
      component={Screens.Dashboard}
    />
  </Tab.Navigator>
);
export default DashboardStack;
