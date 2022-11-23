import React, { FC, useMemo } from 'react';
import App from '../App';
import { AppStackParamList } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faBriefcase,
    faShoppingCart,
    faHeart,
    faHome,
    faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeDrawerNavigation } from './HomeDrawerNavigation';
import { JobNavigation } from './JobNavigation';
import { DatingNavigation } from './DatingNavigation';
import { MessageNavigation } from './MessageNavigation';
import { MarketNavigation } from './MarketNavigation';
import { useAppSelector } from '../hooks/redux';
import { Box, Text } from 'native-base';
const AppTabNavigator = createBottomTabNavigator<AppStackParamList>();

export const AppNavigationStack = () => {
    const {chats} = useAppSelector(({chats})=> ({chats}));

    const unreadCount = useMemo(()=>{
        if(!chats?.length) return ''
        let count = 0;
        chats.forEach(({unreadCount})=> {
            if(unreadCount){
                count += unreadCount;
            }
        });
        if(count > 9) return '9+';
        return count ?  count.toString() : ''
    }, [chats])
    return (
        <AppTabNavigator.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, size, color }) => {
                    if (route.name === 'Home') {
                        return (
                            <FontAwesomeIcon
                                icon={faHome}
                                color={color}
                                size={20}
                            />
                        );
                    }
                    if (route.name === 'Jobs') {
                        return (
                            <FontAwesomeIcon
                                icon={faBriefcase}
                                color={color}
                                size={20}
                            />
                        );
                    }
                    if (route.name === 'Kopa Market') {
                        return (
                            <FontAwesomeIcon
                                icon={faShoppingCart}
                                color={color}
                                size={20}
                            />
                        );
                    }
                    if (route.name === 'Dating') {
                        return (
                            <FontAwesomeIcon
                                icon={faHeart}
                                color={color}
                                size={20}
                            />
                        );
                    }
                    if (route.name === 'Message') {
                        return (
                            <Box position="relative">
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    color={color}
                                    size={20}
                                />
                                {unreadCount ? (
                                    <Box
                                        position="absolute"
                                        left={3}
                                        bottom={2}
                                        paddingY={1}
                                        paddingX={2}
                                        borderRadius="full"
                                        backgroundColor="red.500"
                                        color="white"
                                    >
                                        <Text fontSize={10} color="white">
                                            {unreadCount}
                                        </Text>
                                    </Box>
                                ) : null}
                            </Box>
                        );
                    }
                },
                tabBarActiveTintColor: '#2A9A4A',
                tabBarInactiveTintColor: 'black',
                tabBarStyle: { backgroundColor: '#FDFBF0', paddingTop: 10 },
            })}
        >
            <AppTabNavigator.Screen
                name="Home"
                component={HomeDrawerNavigation}
                options={{ headerShown: false }}
            />
            <AppTabNavigator.Screen
                name="Jobs"
                component={JobNavigation}
                options={{ headerShown: false }}
            />
            <AppTabNavigator.Screen
                name="Kopa Market"
                component={MarketNavigation}
                options={{headerShown: false}}
            />
            <AppTabNavigator.Screen
                name="Dating"
                component={DatingNavigation}
                options= {{headerStyle: {backgroundColor: 'white'}, headerTitleStyle:{color: 'black'}}}
            />
            <AppTabNavigator.Screen
                name="Message"
                component={MessageNavigation}
                options={{headerShown: false}}
            />
        </AppTabNavigator.Navigator>
    );
};
