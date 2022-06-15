import React, { FC } from 'react';
import {
    DrawerContentScrollView,
    DrawerContentComponentProps,
    
} from '@react-navigation/drawer';
import { Button, Box, HStack, Text, Flex, Avatar, Heading, VStack, IconButton, Icon } from 'native-base';
import { useAppSelector } from '../hooks/redux';
import { DrawerParamList } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faBriefcase,
    faGlobeAfrica,
    faHome,
    faHeart,
    faInfo,
} from '@fortawesome/free-solid-svg-icons';
import { getInitialsFromName } from '../services/helpers';
import { Pressable } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useLogout } from '../hooks/useLogOut';

export const DrawerContent: FC<DrawerContentComponentProps> = (props) => {
    const { auth, profile } = useAppSelector(({ auth, profile }) => ({ auth, profile }));
    const { loginInfo  } = profile || {};
    const logoutFlow = useLogout();
    const initial = getInitialsFromName(auth?.displayName || '');
    const navigation  = useNavigation<NavigationProp<DrawerParamList>>();
    const getIcon = (key: keyof DrawerParamList, values: { size: number; color: string; focused: boolean }) => {
        switch (key) {
            case 'Career Profile':
                return <FontAwesomeIcon icon={faBriefcase} {...values} />;
            case 'Dating Profile':
                return <FontAwesomeIcon icon={faHeart} {...values} />;
            case 'Posts':
                return <FontAwesomeIcon icon={faHome} {...values} />;
            case 'Info': 
                return <FontAwesomeIcon icon={faInfo} {...values} />;
            default:
                return <FontAwesomeIcon icon={faGlobeAfrica} {...values} />;
        }
    };

    return (
        <DrawerContentScrollView {...props} style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 24, backgroundColor: 'white', flex: 1 }}>
            <Pressable onPress={()=> navigation.navigate("General Profile", {})}>
            <Flex direction="column" ml={10} flex={1} pr={20}>
                <HStack space={2}>
                    <Avatar source={{ uri: profile?.profileUrl }} bg="primary.200">
                        {initial}
                    </Avatar>
                    <VStack space={1}>
                        <Heading fontSize="md">{auth?.displayName || 'Hello there👋🏽'}</Heading>
                        <Text fontSize="md">{loginInfo?.username ? `@${loginInfo.username}` : ''}</Text>
                        <Text fontSize="xs">Click on to edit profile</Text>
                    </VStack>
                </HStack>
            </Flex>
            </Pressable>
            
            <Flex flex={1} mt={50} pl={10} direction="column" alignItems="center" justifyContent={'center'}>
                {props.state.routeNames.map((name, i) => {
                    const { index } = props.navigation.getState();
                    const isActive = index === i;
                    if (name !== 'General Profile') {
                        return (
                            <Button
                                _text={{ color: isActive ? '#5DB777' : '', textAlign: 'left' }}
                                onPress={() => props.navigation.navigate(name)}
                                key={`menu-item-${i}`}
                                variant="ghost"
                                alignSelf="flex-start"
                            >
                                <HStack space={2} py={5} alignItems="center" justifyContent="flex-start">
                                    {getIcon(name as keyof DrawerParamList, {
                                        size: 16,
                                        color: isActive ? '#5DB777' : 'black',
                                        focused: false,
                                    })}
                                    <Text fontSize="xs">{name}</Text>
                                </HStack>
                            </Button>
                        );
                    }
                })}
            </Flex>
            <Button ml={10} alignSelf="flex-start" variant="ghost" mt={15} onPress={()=> logoutFlow() }>
               <HStack space={2} >
                <Icon size="xs" as = {AntDesign} name="logout" />
                <Text fontSize="xs">Logout</Text>
            </HStack> 
            </Button>
            
        </DrawerContentScrollView>
    );
};
