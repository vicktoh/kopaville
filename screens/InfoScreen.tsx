import { Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import {
   ChevronLeftIcon,
    ChevronRightIcon,
    Flex,
    Heading,
    HStack,
    Icon,
    IconButton,
    Text,
} from 'native-base';
import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { PRIVACY_POLICY_LINK, TERMS_CONDITION_LINK } from '../constants/Storage';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../types';

export const InfoScreen: FC<DrawerScreenProps<DrawerParamList>> = ({ navigation }) => {
   
    return (
        <Flex bg="white" flex={1} px={5} safeArea>
            <IconButton icon={<ChevronLeftIcon />} my={3} onPress={()=> navigation.goBack()} alignSelf="flex-start" />
            <Heading my={5}>kopaville</Heading>

            <TouchableOpacity onPress={()=>Linking.openURL('mailto:contact@kopaville.com')}>
                <Flex
                    direction="row"
                    py={3}
                    justifyContent="space-between"
                    alignItems="center"
                    borderColor="primary.200"
                    borderBottomWidth={1}
                >
                    <HStack space={5} alignItems="center">
                        <Icon color="primary.400" size={6} as={Entypo} name="email" />
                        <Text fontSize="lg">Contact Us</Text>
                    </HStack>
                    <IconButton
                        icon={<ChevronRightIcon />}
                        size="md"
                        variant="ghost"
                    />
                </Flex>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> WebBrowser.openBrowserAsync(TERMS_CONDITION_LINK) }>
                <Flex
                    direction="row"
                    py={3}
                    justifyContent="space-between"
                    alignItems="center"
                    borderColor="primary.200"
                    borderBottomWidth={1}
                >
                    <HStack space={5} alignItems="center">
                        <Icon color="primary.400" size={6} as={FontAwesome5} name="file-contract" />
                        <Text fontSize="lg">Terms of Use</Text>
                    </HStack>
                    <IconButton
                        icon={<ChevronRightIcon />}
                        size="md"
                        variant="ghost"
                    />
                </Flex>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>  WebBrowser.openBrowserAsync(PRIVACY_POLICY_LINK)}>
                <Flex
                    direction="row"
                    py={3}
                    justifyContent="space-between"
                    alignItems="center"
                    borderColor="primary.200"
                    borderBottomWidth={1}
                >
                    <HStack space={5} alignItems="center">
                        <Icon color="primary.400" size={6} as={MaterialIcons} name="privacy-tip" />
                        <Text fontSize="lg">Privacy Policy</Text>
                    </HStack>
                    <IconButton
                        icon={<ChevronRightIcon />}
                        size="md"
                        variant="ghost"
                    />
                </Flex>
            </TouchableOpacity>
            <Flex mt={5}>
               <Heading fontSize="md">About us</Heading>
               <Text></Text>
            </Flex>
        </Flex>
    );
};
