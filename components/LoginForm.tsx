import React, { FC } from 'react';
import { Button, Flex, FormControl, Input, Text, Alert, HStack, VStack } from 'native-base';
import { Formik, Form } from 'formik';

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
    return (
        <Flex direction="column" flex={1}>
            <Formik
                initialValues={initialValues}
                onSubmit={() => {}}
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
                }}
            >
                {({ errors, handleChange, values, handleBlur, touched, isSubmitting, handleSubmit }) => (
                    <Flex direction="column" flex={1} pt={10} px={5}>
                        {errors?.formError ? (
                            <Alert w="100%" status="error" variant="outline">
                                <VStack space={2} flexShrink={1} w="100%">
                                    <HStack flexShrink={1} space={2} justifyContent="space-between">
                                        <HStack space={2} flexShrink={1}>
                                            <Alert.Icon mt="1" />
                                            <Text fontSize="md" color="coolGray.800">
                                                {errors?.formError}
                                            </Text>
                                        </HStack>
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
                            />
                            <FormControl.ErrorMessage>{touched.password && errors.password}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <Button onPress={handleSubmit as any} size="lg" variant="solid" colorScheme="primary">
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
