import React, { FC } from 'react';
import {
    Box,
    Heading,
    ScrollView,
    Flex,
    Divider,
    ArrowBackIcon,
    KeyboardAvoidingView,
    IconButton,
} from 'native-base';
import { Platform } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { RegisterForm } from '../components/RegisterForm';
type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;
export const RegisterScreen: FC<RegisterScreenProps> = ({ navigation }) => {
    const { width, height } = useWindowDimensions();
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView>
                <Flex safeArea direction="column" flex={1} px={5} bg="white" position="relative" pt={5}>
                    <Flex direction="row">
                        <IconButton icon = {<ArrowBackIcon/>} onPress={()=> navigation.navigate('Login')} />
                    </Flex>
                    <Flex direction="column" position="relative" py={10} px={5}>
                        <Box
                            width={30}
                            height={30}
                            top={10}
                            right={width - width * 0.65}
                            bg="secondary.300"
                            position="absolute"
                        />
                        <Box
                            style={{ transform: [{ rotate: '45deg' }] }}
                            width={70}
                            height={70}
                            right={0}
                            bg="secondary.300"
                            position="absolute"
                        />
                        <Heading maxWidth={width * 0.65}>Welcome to Kopaville</Heading>
                        <Divider maxWidth={width * 0.65} bg="secondary.500" />
                        <Heading maxWidth={width * 0.65} size="md" color="primary.400">
                            We are excited to have you
                        </Heading>
                    </Flex>
                    <Box position="relative">
                        {/* <Box
                            width={300}
                            height={300}
                            top={20}
                            rounded={150}
                            style={{ transform: [{ translateX: -100 }, { rotate: '45deg' }] }}
                            position="absolute"
                            bg="secondary.200"
                        /> */}
                        <RegisterForm />
                    </Box>
                </Flex>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
