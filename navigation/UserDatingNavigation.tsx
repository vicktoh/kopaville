import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserDatingStackParamList, JobStackParamList } from '../types';

import { DatingListScreen } from '../screens/DatingListScreen';
import { DatingProfileScreen } from '../screens/DatingProfileScreen';
import { DatingScreen } from '../screens/DatingScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { EditDatingProfileScreen } from '../screens/EditDatingProfileScreen';

const UserDatingStack = createNativeStackNavigator<UserDatingStackParamList>();

export const UserDatingNavigation = () => {
    return (
        <UserDatingStack.Navigator initialRouteName="My Dating Profile">
                <UserDatingStack.Screen name="My Dating Profile" component={DatingScreen} options={{ headerShown: false }} />
                <UserDatingStack.Screen name="Edit Dating Profile" component={EditDatingProfileScreen} options={{ headerShown: false }} />
        </UserDatingStack.Navigator>
    );
};