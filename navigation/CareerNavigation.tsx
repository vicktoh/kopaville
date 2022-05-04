import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CareerStackParamList } from '../types';
import { ProfileScreen } from '../screens/ProfileScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { CareerScreen } from '../screens/CareerScreen';
import { BusinessScreen } from '../screens/BusinessScreen';



const CareerStack = createNativeStackNavigator<CareerStackParamList>();

export const CareerNavigation = () => {
    return (
        <CareerStack.Navigator initialRouteName='Main'>
                <CareerStack.Screen name="Main" component={CareerScreen} options={{ headerShown: false, headerStyle: {backgroundColor: 'white'} }} />
                <CareerStack.Screen name="Bussiness" component={BusinessScreen} options={{ headerShown: false }} />
        </CareerStack.Navigator>
    );
};
