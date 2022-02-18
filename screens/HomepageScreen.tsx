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
import { AuthStackParamList, DrawerParamList } from '../types';
import { RegisterForm } from '../components/RegisterForm';
import { useAppSelector } from '../hooks/redux';
const corperTwins = require('../assets/images/corpertwins.png');
type HomepageScreenProps = NativeStackScreenProps<DrawerParamList, 'Posts'>;
export const HomepageScreen: FC<HomepageScreenProps> = ({ navigation }) => {
    const { width, height } = useWindowDimensions();
    const {auth} = useAppSelector(({auth, systemInfo }) => ({ auth , systemInfo}));
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView>
                <Flex  direction="column" flex={1} px={1} bg="white" position="relative" py={2}>
                    <Flex direction="row">
                       <Heading fontSize="sm" >{ auth  ? auth.displayName: 'Hello there👋🏽'}</Heading>
                    </Flex>
                    <Box position="relative">
                        
                    </Box>
                </Flex>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
