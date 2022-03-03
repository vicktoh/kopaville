import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types';
import { ProfileScreen } from '../screens/ProfileScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';



const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileNavigation = () => {
    return (
        <ProfileStack.Navigator initialRouteName='Main'>
                <ProfileStack.Screen name="Main" component={ProfileScreen} options={{ headerShown: false }} />
                <ProfileStack.Screen name="Edit" component={EditProfileScreen} options={{ headerShown: false }} />
        
        </ProfileStack.Navigator>
    );
};
