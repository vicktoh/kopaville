import React, { FC } from 'react';
import {
    Button,
    Flex,
    FormControl,
    Input,
    Text,
    Box,
    Alert,
    HStack,
    VStack,
    Select,
    Checkbox,
    ChevronDownIcon,
} from 'native-base';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { useAppDispatch } from '../hooks/redux';
import { registerUser } from '../services/authServices';
import { setLocalData } from '../services/local';
import { LOCAL_USER_INFO } from '../constants/Storage';
import { setAuth } from '../reducers/authSlice';
import { User } from '../types/User';
export type FormValues = {
    fullname: string;
    email: string;
    username: string;
    type: 'individual' | 'organisation';
    password: string;
    confirm: string;
    agreed: boolean;
    formError?: string;
};

const initialValues: FormValues = {
    fullname: '',
    email: '',
    username: '',
    password: '',
    type: 'individual',
    confirm: '',
    agreed: false,
};
const RegistrationSchema = yup.object().shape({
    email: yup.string().email('Invalid Email').required('Required!'),
    fullname: yup.string().required('Required!').min(5, 'Must be at least 5 characters'),
    username: yup.string().required('Required!'),
    password: yup.string().min(6, 'Must be at least 6 characters').required('Required!'),
    confirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
    type: yup.string().required('Required!'),
    agreed: yup.boolean().isTrue('Accept terms and conditions'),
});

export const RegisterForm: FC = () => {
    const dispatch = useAppDispatch();

    return (
        <Flex direction="column" flex={1}>
            <Formik
                initialValues={initialValues}
                onSubmit={async (values, { setFieldError, setSubmitting }) => {
                    const res = await registerUser(values);
                    if (res?.status === 'failed') {
                        setFieldError('formError', res.message);
                        setSubmitting(false);
                    }
                    if (res?.user) {
                        await setLocalData(LOCAL_USER_INFO, JSON.stringify(res.user));
                        dispatch(setAuth(res.user));
                    }
                }}
                validationSchema={RegistrationSchema}
            >
                {({ errors, handleChange, values, handleBlur, touched, isSubmitting, setFieldValue, handleSubmit }) => (
                    <Flex direction="column" flex={1} pt={3} px={5} bg="transparent">
                        {errors?.formError ? (
                            <Alert w="100%" status="error" variant="subtle" mb={5}>
                                <VStack space={2} flexShrink={1} w="100%">
                                    <HStack space={3}>
                                        <Alert.Icon mt="1" alignSelf="center" />
                                        <Box fontSize="md">{errors?.formError}</Box>
                                    </HStack>
                                </VStack>
                            </Alert>
                        ) : null}
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            isRequired
                            mb={3}
                            isInvalid={!!touched.fullname && !!errors.fullname}
                        >
                            <FormControl.Label>fullname</FormControl.Label>
                            <Input
                                size="lg"
                                value={values.fullname}
                                onBlur={handleBlur('fullname')}
                                onChangeText={handleChange('fullname')}
                                variant="filled"
                                bg="primary.100"
                            />
                            <FormControl.ErrorMessage>{touched.fullname && errors.fullname}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
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
                            />
                            <FormControl.ErrorMessage>{touched.email && errors.email}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            isRequired
                            mb={3}
                            isInvalid={!!touched.username && !!errors.username}
                        >
                            <FormControl.Label>username</FormControl.Label>
                            <Input
                                size="lg"
                                value={values.username}
                                onBlur={handleBlur('username')}
                                onChangeText={handleChange('username')}
                                variant="filled"
                                bg="primary.100"
                            />
                            <FormControl.ErrorMessage>{touched.username && errors.username}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            isRequired
                            mb={3}
                            isInvalid={!!touched.type && !!errors.type}
                            bg="white"
                        >
                            <FormControl.Label>account type</FormControl.Label>
                            <Select
                                onValueChange={(value) => setFieldValue('type', value)}
                                _actionSheetContent={{ bg: 'white' }}
                                _selectedItem={{ bg: 'primary.100', color: 'gray.700' }}
                                bg="primary.100"
                                dropdownIcon={<ChevronDownIcon color="black" />}
                                accessibilityLabel="Choose account type"
                                size="lg"
                                selectedValue={values.type}
                                variant="filled"
                            >
                                <Select.Item value="individual" label="individual" />
                                <Select.Item value="organisation" label="organisation" />
                            </Select>
                            <FormControl.ErrorMessage>{touched.type && errors.type}</FormControl.ErrorMessage>
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
                                color="primary.500"
                                size="lg"
                                value={values.password}
                                onBlur={handleBlur('password')}
                                onChangeText={handleChange('password')}
                                variant="filled"
                                bg="primary.100"
                                secureTextEntry
                            />
                            <FormControl.ErrorMessage>{touched.password && errors.password}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            isRequired
                            mb={3}
                            isInvalid={!!touched.confirm && !!errors.confirm}
                        >
                            <FormControl.Label>confirm</FormControl.Label>
                            <Input
                                size="lg"
                                value={values.confirm}
                                onBlur={handleBlur('confirm')}
                                onChangeText={handleChange('confirm')}
                                variant="filled"
                                bg="primary.100"
                                secureTextEntry
                                color="primary.500"
                            />
                            <FormControl.ErrorMessage>{touched.confirm && errors.confirm}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>

                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            isRequired
                            mb={3}
                            isInvalid={!!touched.password && !!errors.password}
                        >
                            <HStack space={3}>
                                <Checkbox
                                    accessibilityLabel="agree to terms"
                                    value="agreed"
                                    isChecked={values.agreed}
                                    onChange={(checked) => setFieldValue('agreed', checked)}
                                />
                                <FormControl.Label>Agree to our terms and conditions</FormControl.Label>
                            </HStack>
                            <FormControl.ErrorMessage>{touched.password && errors.password}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <Button
                            disabled={isSubmitting}
                            isLoading={isSubmitting}
                            onPress={handleSubmit as any}
                            size="lg"
                            variant="solid"
                            colorScheme="primary"
                            mb={5}
                        >
                            Register
                        </Button>
                    </Flex>
                )}
            </Formik>
        </Flex>
    );
};
