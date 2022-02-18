/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import useColorScheme from '../hooks/useColorScheme';
import { setAuth } from '../reducers/authSlice';
import { StoreType } from '../reducers/store';

import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import { User } from '../types/User';
import { AppNavigationStack } from './AppNavigation';
import { HomeDrawerNavigation } from './HomeDrawerNavigation';
import { AuthNavigation } from './AuthNavigation';
import LinkingConfiguration from './LinkingConfiguration';
import { System } from '../types/System';
import { setSystemInfo } from '../reducers/systemSlice';

export default function Navigation({ colorScheme, localAuth, localSystemInfo }: { colorScheme: ColorSchemeName, localAuth: User | null, localSystemInfo: System | null }) {
  const {auth, systemInfo} = useAppSelector<StoreType>(( store ) =>  store);
  const dispatch = useAppDispatch();
  React.useEffect(()=>{
    if(localAuth && !auth) {
      dispatch(setAuth(localAuth));
    }
    if(localSystemInfo && !systemInfo){
      dispatch(setSystemInfo(localSystemInfo))
    }
  }, [localAuth, localSystemInfo])
  
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {
          auth ? (
            <AppNavigationStack />
          ): 
          <AuthNavigation />
        }
    </NavigationContainer>
  );
}


