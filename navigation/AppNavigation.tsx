
import React, {FC} from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import App from '../App';
import { AppStackParamList } from '../types';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
const AppNavigator = createNativeStackNavigator<AppStackParamList>();


export const AppNavigationStack = ()=>{
    return (
        <AppNavigator.Navigator initialRouteName='Home'>
            <AppNavigator.Screen name = "Home" component = {TabOneScreen} />
            <AppNavigator.Screen name = "Jobs" component = {TabOneScreen} />
            <AppNavigator.Screen name = "MarketPlace" component = {TabOneScreen} />
            <AppNavigator.Screen name = "Dating" component = {TabOneScreen} />
        </AppNavigator.Navigator>
    )
} 