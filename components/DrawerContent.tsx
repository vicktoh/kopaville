import React, { FC, ReactElement } from 'react';
import {
    DrawerContentScrollView,
    DrawerContentComponentProps,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import { DropFirst } from 'reselect/es/types';
import { Button,  Box, HStack, Text, Flex, Avatar, Heading, VStack } from 'native-base';
import { useAppSelector } from '../hooks/redux';
import { StoreType } from '../reducers/store';
import { DrawerParamList } from '../types';
import { User } from '../types/User';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faBriefcase,
    faGlobeAfrica,
    faHome,
    faShoppingCart,
    faHeart,
    faBook,
    faHistory,
} from '@fortawesome/free-solid-svg-icons';
import { startAt } from '@firebase/firestore';
import { RotateInUpLeft } from 'react-native-reanimated';

export const DrawerContent: FC<DrawerContentComponentProps> = (props) => {
    const auth = useAppSelector(({ auth }) => auth);
    const initial = auth?.displayName
    const getIcon = (key: keyof DrawerParamList, values: { size: number; color: string, focused: boolean }) => {
        switch (key) {
            case 'Bookstore':
                return <FontAwesomeIcon  icon={faBook} {...values} />;
            case 'Career Profile':
                return <FontAwesomeIcon icon={faBriefcase} {...values} />;
            case 'Dating Profile':
                return <FontAwesomeIcon icon={faHeart} {...values} />;
            case 'Historyville':
                return <FontAwesomeIcon icon={faHistory} {...values} />;
            case 'Posts':
                return <FontAwesomeIcon icon={faHome} {...values} />;
            default:
                return <FontAwesomeIcon icon={faGlobeAfrica} {...values} />;
        }
    };

   
    return (
        <DrawerContentScrollView {...props} style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 24 }}>
            <Flex direction="column" pr = {20}>
                <HStack space={2}>
                    <Avatar bg="primary.200" source={{ uri: auth?.photoUrl }}>
                        {initial}
                    </Avatar>
                    <VStack space={1}>
                        <Heading fontSize= "md">{auth?.displayName || 'Hello there👋🏽'}</Heading>
                        <Text fontSize="xs">Click on your avatar to edit your profile</Text>
                    </VStack>
                </HStack>
            </Flex>
            <Box mt={50} pl={20} >
            {props.state.routeNames.map((name, i) => {
                const { index } = props.navigation.getState();
                const isActive = index === i;
                if (name !== 'Profile') {
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
            </Box>
            
        </DrawerContentScrollView>
    );
};
