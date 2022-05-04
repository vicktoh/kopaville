import React, { FC, useState } from 'react';
import {
    Box,
    Alert,
    Icon,
    VStack,
    HStack,
    Heading,
    Text,
    Flex,
    Image,
    IconButton,
    Button,
    ScrollView,
    FormControl,
    Input,
    ArrowBackIcon,
    useToast,
} from 'native-base';
import { useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { sendRecoverPassword } from '../services/authServices';

const corperTwins = require('../assets/images/corpertwins.png');

type PasswordRecoveryScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export const PasswordRecoveryScreen: FC<PasswordRecoveryScreenProps> = ({ navigation }) => {
    const { width, height } = useWindowDimensions();
    const [email, setEmail] = useState<string>('');
    const [recovering, setRecovering] = useState<boolean>(false);
    const [recoveryError, setRecoveryError] = useState<string>('');
    const [recoverySuccess, setRecoverySuccess] = useState<string>('');
    const  toast = useToast();
    const recoverPassword = async ()=>{
        if(!email) return;

        setRecovering(true);
        const response = await sendRecoverPassword(email);
        if(response?.status === 'success'){
            toast.show({
                title: "Password Reset Email Sent",
            status: "success",
            description: "Check your email and follow the link sent."
            })
            setRecoveryError('');
            setRecoverySuccess("Password Reset Email Sent");
        }
        if(response?.status === 'failed'){

            setRecoveryError(response.message)
        }
        
        setRecovering(false)
    }
    return (
        <ScrollView bg="white">
            <Flex safeArea direction="column" flex={1} px={5} bg="white" position="relative">
                <IconButton variant="ghost" icon = {<ArrowBackIcon/>} onPress = {()=>{navigation.navigate('Login')}}/>
                <Box
                    width={300}
                    height={300}
                    rounded={80}
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
                <Flex direction="column" flex={3} px={5}>
                    <Heading fontSize="lg" mt={5}>
                        {' '}
                        Forgot Your Password ?.
                    </Heading>
                    <Text fontSize="md" my = {3}>Dont worry we’ve got you, provide your email in the input below</Text>
                    {recoveryError ? (
                        <Alert w="100%" status="error" variant="subtle" mb={5} mt={10}>
                            <VStack flexShrink={1} w="100%">
                                <HStack space={5} alignContent="center">
                                    <Alert.Icon mt="1" />
                                    <Box fontSize="md" color="coolGray.800" alignSelf="center">
                                        {recoveryError}
                                    </Box>
                                </HStack>
                            </VStack>
                        </Alert>
                    ) : null}
                    {recoverySuccess ? (
                        <Alert w="100%" status="success" variant="subtle" mb={5} mt={10}>
                            <VStack flexShrink={1} w="100%">
                                <HStack space={5} alignContent="center">
                                    <Alert.Icon mt="1" />
                                    <Box fontSize="md" color="coolGray.800" alignSelf="center">
                                        {recoverySuccess}
                                    </Box>
                                </HStack>
                            </VStack>
                        </Alert>
                    ) : null}

                    <FormControl _text={{ fontSize: 'lg' }} isRequired mb={3} isInvalid={!!email}>
                        <FormControl.Label>email</FormControl.Label>
                        <Input
                            autoCapitalize={'none'}
                            size="lg"
                            value={email}
                            onChangeText={(value) => setEmail(value)}
                            variant="filled"
                            bg="primary.100"
                            autoCorrect={false}
                        />
                        <FormControl.HelperText></FormControl.HelperText>
                    </FormControl>
                </Flex>

                <Flex px={5}>
                    <Button
                        disabled={!!!email}
                        size="lg"
                        variant="solid"
                        colorScheme="primary"
                        isLoading={recovering}
                        isLoadingText="Please wait"
                        onPress={() => recoverPassword()}
                    >
                        Recover
                    </Button>
                </Flex>
            </Flex>
        </ScrollView>
    );
};
