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
import { useAppSelector } from '../hooks/redux';
import useColorScheme from '../hooks/useColorScheme';
import { StoreType } from '../reducers/store';

import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import { AppNavigationStack } from './AppNavigation';
import { AuthNavigation } from './AuthNavigation';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const {auth} = useAppSelector<StoreType>(( store ) =>  store);
  
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


