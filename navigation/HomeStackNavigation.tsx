import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types';

import { HomepageScreen } from '../screens/HomepageScreen';
import { ExplorePostScreen } from '../screens/ExplorePostScreen';
import { ExploreUsersScreen } from '../screens/ExploreUsersScreen';
import { CommentsScreen } from '../screens/CommentsScreen';

const HomePageStack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackNavigation = () => {
    return (
        <HomePageStack.Navigator initialRouteName="Home">
            <HomePageStack.Group>
                <HomePageStack.Screen name="Home" component={HomepageScreen} options={{ headerShown: false }} />
                <HomePageStack.Screen
                    name="Explore Post"
                    component={ExplorePostScreen}
                    options={{ headerShown: false }}
                />
                <HomePageStack.Screen
                    name="Explore Users"
                    component={ExploreUsersScreen}
                    options={{ headerShown: false }}
                />
                <HomePageStack.Screen name = "Profile" component={CommentsScreen} options={{headerShown: false}} />
            </HomePageStack.Group>
            <HomePageStack.Group screenOptions={{ presentation: 'modal' }}>
                <HomePageStack.Screen name="Comments" component={CommentsScreen} options={{ headerShown: false }} />
            </HomePageStack.Group>
        </HomePageStack.Navigator>
    );
};
