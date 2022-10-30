import React, { FC } from 'react';
import { Button,Box, Flex, FormControl, Input, Text, Alert, HStack, VStack } from 'native-base';
import { Formik, Form, FormikBag, FormikHelpers } from 'formik';
import { loginUser } from '../services/authServices';
import { setLocalData } from '../services/local';
import { useAppDispatch } from '../hooks/redux';
import { LOCAL_USER_INFO } from '../constants/Storage';
import { setAuth } from '../reducers/authSlice';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../types';
import { User } from '../types/User';

type FormValues = {
    email: string;
    password: string;
    formError?: string;
};

const initialValues: FormValues = {
    email: '',
    password: '',
};

export const LoginForm: FC = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
    
    const onSubmit = async ({email, password}: FormValues, { setFieldError, setSubmitting }: FormikHelpers<FormValues>) =>{
        const status = await loginUser({email, password});
        if(status?.status === 'success' && status.user ){
            await setLocalData(LOCAL_USER_INFO, JSON.stringify(status.user));
            dispatch(setAuth(status.user as User));
        }
        if(status?.status === "failed"){
            setFieldError('formError', status.message);
            setSubmitting(false);
        }
    }
    return (
        <Flex direction="column" flex={1}>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validate={(values) => {
                    const errors: Partial<FormValues> = {};
                    if (!values.email) {
                        errors.email = 'Required';
                    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                        errors.email = 'Invalid email address';
                    }

                    if (!values.password) {
                        errors.password = 'Required';
                    }
                    if (values.password.length < 6) {
                        errors.password = 'Must be at least 6 characters';
                    }
                    return errors;
                }}
            >
                {({ errors, handleChange, values, handleBlur, touched, isSubmitting, handleSubmit }) => (
                    <Flex direction="column" flex={1} pt={10} px={5}>
                        {errors?.formError ? (
                            <Alert w="100%" status="error" variant="subtle" mb={5}>
                                <VStack  flexShrink={1} w="100%">
                                    <HStack space={5} alignContent="center">
                                            <Alert.Icon mt="1" />
                                            <Box fontSize="md" color="coolGray.800" alignSelf="center">
                                                {errors?.formError}
                                            </Box>
                                    </HStack>
                                </VStack>
                            </Alert>
                        ) : null}
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            isRequired
                            mb={3}
                            isInvalid={!!touched.email && !!errors.email}
                        >
                            <FormControl.Label>email</FormControl.Label>
                            <Input
                                size="lg"
                                value={values.email}
                                onBlur={handleBlur('email')}
                                onChangeText={handleChange('email')}
                                variant="filled"
                                bg="primary.100"
                                autoCorrect={false}
                            />
                            <FormControl.ErrorMessage>{touched.email && errors.email}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            isRequired
                            mb={3}
                            isInvalid={!!touched.password && !!errors.password}
                        >
                            <FormControl.Label>password</FormControl.Label>
                            <Input
                                size="lg"
                                value={values.password}
                                onBlur={handleBlur('password')}
                                onChangeText={handleChange('password')}
                                variant="filled"
                                bg="primary.100"
                                autoCorrect= {false}
                                secureTextEntry
                            />
                            <FormControl.ErrorMessage>{touched.password && errors.password}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl mt = {2} mb={5}>
                            <Button onPress={()=> navigation.navigate('Forgot')} alignSelf="flex-start" variant="link" size="md">Forgot password?</Button>
                        </FormControl>
                        <Button disabled={isSubmitting} isLoading={isSubmitting} isLoadingText='Please Wait...' onPress={handleSubmit as any} size="lg" variant="solid" colorScheme="primary">
                            Login
                        </Button>
                        <Text my={3} fontSize="lg" textAlign="center" flex={1}>
                            or
                        </Text>
                    </Flex>
                )}
            </Formik>
        </Flex>
    );
};
