import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DatingStackParamList, JobStackParamList } from '../types';

import { DatingListScreen } from '../screens/DatingListScreen';
import { DatingProfileScreen } from '../screens/DatingProfileScreen';

const JobStack = createNativeStackNavigator<DatingStackParamList>();

export const DatingNavigation = () => {
    return (
        <JobStack.Navigator initialRouteName='Main'>
                <JobStack.Screen name="Main" component={DatingListScreen} options={{ headerShown: false }} />
                <JobStack.Screen name="Profile" component={DatingProfileScreen} options={{ headerShown: false }} />
        </JobStack.Navigator>
    );
};
