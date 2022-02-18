import React, { FC } from 'react';
import { Box, Heading, Center, Text, Flex, Image, Button, ScrollView } from 'native-base';
import { LoginForm } from '../components/LoginForm';
import { useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';

const corperTwins = require('../assets/images/corpertwins.png');

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export const LoginScreen: FC<LoginScreenProps> = ({navigation}) => {
    const { width, height } = useWindowDimensions();
    return (
        <ScrollView bg = "white">
        <Flex safeArea direction="column" flex={1} px={5} bg="white" position="relative">
            <Box
                width={300}
                height={300}
                rounded={150}
                right="-20%"
                style={{
                    transform: [
                        {
                            translateY: height / 2 - 150,
                        },
                    ],
                }}
                bg="secondary.100"
                position="absolute"
            ></Box>
            <Flex direction="column" flex={3} >
                <Heading fontSize="lg" mt={5}>
                    {' '}
                    Kopaville.
                </Heading>
                <Heading ml = {5} fontSize="md" mt={10} fontWeight="semibold">
                    Login
                </Heading>
                <LoginForm />
            </Flex>
            <Flex direction="row" flex={2} bg="white">
                <Flex flex={3} direction="column" alignItems="center" justifyContent="center" pl={5}>
                    <Heading fontSize="xl" lineHeight="sm" textAlign="center">
                        Join the community
                    </Heading>
                    <Text fontSize="sm" mt="3" fontWeight="semibold" textAlign="center" color="primary.400">
                        network, share, hangout, bussiness
                    </Text>
                </Flex>
                <Flex flex={3} p={2}>
                    <Image source={corperTwins} flex={1} alt="Youth corper Image" />
                </Flex>
            </Flex>
            <Flex px={5}>
                <Button onPress={()=> navigation.navigate('Register')} size="lg" variant="solid" colorScheme="primary">
                    Register
                </Button>
            </Flex>
        </Flex>
        </ScrollView>
    );
};
