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
import { listenOnFollowers, listenonFollowing, listenOnTimeline } from '../services/postsServices';
import { setFollowership } from '../reducers/followershipSlice';
import { setPosts } from '../reducers/postSlice';
import { fetchUserProfile } from '../services/profileServices';
import { setProfile } from '../reducers/profileSlice';

export default function Navigation({
    colorScheme,
    localAuth,
    localSystemInfo,
}: {
    colorScheme: ColorSchemeName;
    localAuth: User | null;
    localSystemInfo: System | null;
}) {
    const { auth, systemInfo, followerships, posts, profile } = useAppSelector<StoreType>((store) => store);
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        if (localAuth && !auth) {
            dispatch(setAuth(localAuth));
        }
        if (localSystemInfo && !systemInfo) {
            dispatch(setSystemInfo(localSystemInfo));
        }
    }, [localAuth, localSystemInfo, followerships]);

    React.useEffect(() => {
        if (!followerships?.followers && auth) {
            try {
                const unsubscribe = listenOnFollowers(auth.userId, (data) =>
                    dispatch(setFollowership({ followers: data }))
                );
                return unsubscribe;
            } catch (error) {
                console.log(error);
            }
        }
    }, [followerships?.followers, auth]);

    React.useEffect(() => {
        if (!followerships?.following && auth) {
            try {
                const unsubscribe = listenonFollowing(auth.userId, (data) =>
                    dispatch(setFollowership({ following: data }))
                );
                return unsubscribe;
            } catch (error) {
                console.log(error);
            }
        }
    }, [followerships?.following, auth]);

    React.useEffect(() => {
        if (!posts && followerships?.following && auth) {
            try {
                const unsubscribe = listenOnTimeline(
                    [...followerships.following.map(({ userId }) => userId), auth.userId],
                    (data) => dispatch(setPosts(data)),
                    (e) => console.log(e)
                );
                return unsubscribe;
            } catch (error) {
                console.log(error);
            }
        }
    }, [followerships?.following, posts, auth]);

    React.useEffect(() => {
        if (auth && !profile) {
            try {
                const unsubscribe = fetchUserProfile(auth.userId, (data) => {
                    dispatch(setProfile(data));
                });
            } catch (error) {
                console.log(error);
            }
        }
    }, [auth, profile]);
    return (
        <NavigationContainer linking={LinkingConfiguration} theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            {auth ? <AppNavigationStack /> : <AuthNavigation />}
        </NavigationContainer>
    );
}