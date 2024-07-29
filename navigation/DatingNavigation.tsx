import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DatingStackParamList, JobStackParamList } from '../types';

import { DatingListScreen } from '../screens/DatingListScreen';
import { DatingProfileScreen } from '../screens/DatingProfileScreen';
import { DatingFilterForm } from '../components/DatingFilterForm';
import { ChevronLeftIcon, IconButton } from 'native-base';

const DatingStack = createNativeStackNavigator<DatingStackParamList>();

export const DatingNavigation = () => {
    return (
        <DatingStack.Navigator initialRouteName="Main">
            <DatingStack.Screen
                name="Main"
                component={DatingListScreen}
                options={{ headerShown: false }}
            />
            <DatingStack.Screen
                name="Search"
                component={DatingFilterForm}
                options={{ headerShown: false }}
            />
            <DatingStack.Screen
                name="Profile"
                component={DatingProfileScreen}
                options={{
                    headerShown: false,
                }}
            />
        </DatingStack.Navigator>
    );
};
