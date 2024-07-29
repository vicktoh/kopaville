import { Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import {
   ChevronLeftIcon,
    ChevronRightIcon,
    Flex,
    Heading,
    HStack,
    Icon,
    IconButton,
    Pressable,
    Text,
    useDisclose,
} from 'native-base';
import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { PRIVACY_POLICY_LINK, SUPPORT_EMAIL, TERMS_CONDITION_LINK } from '../constants/Storage';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../types';
import { Modal } from 'react-native';
import { DeleteAccount } from '../components/DeleteAccount';

export const InfoScreen: FC<DrawerScreenProps<DrawerParamList>> = ({ navigation }) => {
   const {isOpen, onOpen, onClose} = useDisclose();
    return (
        <Flex bg="white" flex={1} px={5} safeArea>
            <IconButton icon={<ChevronLeftIcon />} my={3} onPress={()=> navigation.goBack()} alignSelf="flex-start" />
            <Heading my={5}>Kopaville</Heading>

            <TouchableOpacity onPress={()=>Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}>
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
            <TouchableOpacity onPress={onOpen}>
                <Flex
                    direction="row"
                    py={3}
                    justifyContent="space-between"
                    alignItems="center"
                    borderColor="primary.200"
                    borderBottomWidth={1}
                >
                    <HStack space={5} alignItems="center">
                        <Icon color="red.400" size={6} as={MaterialIcons} name="account-box" />
                        <Text fontSize="lg">Delete My account</Text>
                    </HStack>
                    <IconButton
                        icon={<ChevronRightIcon />}
                        size="md"
                        variant="ghost"
                    />
                </Flex>
            </TouchableOpacity>
            <Modal visible={isOpen} animationType="slide" transparent={true} style={{flex: 1}}>
                <DeleteAccount onClose={onClose} />
            </Modal>
            {/* <Flex mt={5}>
               <Heading fontSize="md">About us</Heading>
               <Text></Text>
            </Flex> */}
        </Flex>
    );
};
