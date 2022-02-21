import React, { FC } from 'react';
import {
    Box,
    Heading,
    ScrollView,
    Flex,
    Button,
    Divider,
    ArrowBackIcon,
    KeyboardAvoidingView,
    IconButton,
    Icon
} from 'native-base';
import { Platform } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerParamList } from '../types';
import { SetupChecklist } from '../components/SetupChecklist';
import { useAppSelector } from '../hooks/redux';
import { countComplette, onboardingCheckListComplete } from '../services/helpers';
const corperTwins = require('../assets/images/corpertwins.png');
type HomepageScreenProps = NativeStackScreenProps<DrawerParamList, 'Posts'>;
export const HomepageScreen: FC<HomepageScreenProps> = ({ navigation }) => {
    const { width, height } = useWindowDimensions();
    const {auth, systemInfo} = useAppSelector(({auth, systemInfo }) => ({ auth , systemInfo}));
    const firstname = (auth?.displayName || "").split(" ")[0];
    const showChecklist = !!!(systemInfo?.checkList && onboardingCheckListComplete(systemInfo.checkList)); 
    const count = systemInfo?.checkList ? countComplette(systemInfo.checkList) : 0; 
    return (
        <KeyboardAvoidingView flex={1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} bg= "white">
            <ScrollView flex = {1}  bg= "white">
                <Flex   bg="blue" position="relative" py={2}>
                    <Flex px={5} direction="row" mt = {5}>
                       <Heading fontSize="xl" >{ auth  ? `Hello, ${firstname}👋🏽`: 'Hello there👋🏽'}</Heading>
                    </Flex>
                    {
                        showChecklist ? <SetupChecklist /> : null
                    }
                </Flex>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
