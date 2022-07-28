import React, { FC } from 'react';
import { FieldArray, Formik } from 'formik';
import {
    Flex,
    FormControl,
    HStack,
    Input,
    Button,
    Alert,
    VStack,
    Box,
    Heading,
    IconButton,
    Icon,
    useToast,
    TextArea,
    Select,
    ChevronDownIcon,
} from 'native-base';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import * as yup from 'yup';
import { Business } from '../types/Job';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { postService } from '../services/jobServices';
import { Billing } from '../types/Billing';
import { updateBillingInfo } from '../services/productServices';
import { setBilling } from '../reducers/billingSlice';

const states: string[] = require('../assets/static/states.json');
type BillingFormProps = {
   onSuccess: () => void;
};

const ServiceSchema = yup.object().shape({
    phone: yup.string().required('Required!'),
    address: yup.string().required('Required'),
    state: yup.string().required('Required'),
    city: yup.string().required('Required'),
    postalCode: yup.string().max(5, 'Only number allowed'),
});

export const BillingForm: FC<BillingFormProps> = ({ onSuccess }) => {
    const { auth, billing  } = useAppSelector(({ auth, billing }) => ({
        auth,
        billing
    }));
    const toast = useToast();
    const dispatch = useAppDispatch();
    const initialValue: Billing & { formError?: string } = billing || {
        address: '',
        city: '',
        state: '',
        phone: '',
        postalCode: '',
        closestLandmark: ''
    };


    

    return (
        <Flex flex={1}>
            <Formik
                validationSchema={ServiceSchema}
                initialValues={initialValue}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        await updateBillingInfo(auth?.userId || "", values);
                        dispatch(setBilling(values));
                        onSuccess();
                    } catch (error) {
                        const err: any = error;
                        toast.show({
                            title: 'Error Occured',
                            description:
                                err?.message || "Could not post business, make sure you're connected to the internet",
                            status: 'error',
                        });
                    } finally {
                    
                    }
                }}
            >
                {({ values, touched, errors, handleChange, handleBlur, isSubmitting, submitForm, setFieldValue }) => (
                    <Flex direction="column" flex={1} mt={5}>
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
                            isInvalid={!!touched.address && !!errors.address}
                        >
                            <FormControl.Label>Delivery Address</FormControl.Label>
                            <TextArea
                                size="lg"
                                value={values.address}
                                onBlur={handleBlur('address')}
                                onChangeText={handleChange('address')}
                                variant="outline"
                                borderColor="primary.400"
                                placeholder="Eg. House 3, Pickford Street Ademola Str"
                            />

                            <FormControl.ErrorMessage>{touched.address && errors.address}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            mb={3}
                            isInvalid={!!touched.closestLandmark && !!errors.closestLandmark}
                        >
                            <FormControl.Label>closestLandmark</FormControl.Label>
                            <Input
                                size="lg"
                                value={values.closestLandmark}
                                onBlur={handleBlur('closestLandmark')}
                                onChangeText={handleChange('closestLandmark')}
                                variant="outline"
                                borderColor="primary.400"
                                placeholder="Closest landmark"
                            />
                            <FormControl.ErrorMessage>
                                {touched.closestLandmark && errors.closestLandmark}
                            </FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            isRequired
                            mb={3}
                            isInvalid={!!touched.state && !!errors.state}
                        >
                            <FormControl.Label>State</FormControl.Label>
                            <Input
                                size="lg"
                                value={values.state}
                                onBlur={handleBlur('state')}
                                onChangeText={handleChange('state')}
                                variant="outline"
                                borderColor="primary.400"
                                placeholder="state"
                            />
                            <FormControl.ErrorMessage>
                                {touched.state && errors.state}
                            </FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            mb={3}
                            isInvalid={!!touched.city && !!errors.city}
                        >
                            <FormControl.Label>City</FormControl.Label>
                            <Input
                                size="lg"
                                value={values.city}
                                onBlur={handleBlur('city')}
                                onChangeText={handleChange('city')}
                                variant="outline"
                                borderColor="primary.400"
                                placeholder="City"
                            />

                            <FormControl.ErrorMessage>{touched.city && errors.city}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            mb={3}
                            isInvalid={!!touched.phone && !!errors.phone}
                        >
                            <FormControl.Label>Phone Number</FormControl.Label>
                            <Input
                                size="lg"
                                value={values.phone}
                                onBlur={handleBlur('phone')}
                                onChangeText={handleChange('phone')}
                                variant="outline"
                                borderColor="primary.400"
                                placeholder="Phone Number"
                            />

                            <FormControl.ErrorMessage>{touched.phone && errors.phone}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>

                        
                        <FormControl _text={{ fontSize: 'lg' }} mb={5} isInvalid={!!touched.postalCode && !!errors.postalCode}>
                            <FormControl.Label>Postal Code</FormControl.Label>
                            <Input
                                size="lg"
                                value={values.postalCode}
                                onBlur={handleBlur('postalCode')}
                                onChangeText={handleChange('postalCode')}
                                variant="outline"
                                borderColor="primary.400"
                                placeholder="Postal Code"
                            />

                            <FormControl.ErrorMessage>{touched.postalCode && errors.postalCode}</FormControl.ErrorMessage>
                            <FormControl.HelperText>only number allowed</FormControl.HelperText>
                        </FormControl>
                        
                        <Button
                            isLoading={isSubmitting}
                            isLoadingText="Please Wait"
                            onPress={() => submitForm()}
                            size="lg"
                            variant="solid"
                            colorScheme="primary"
                            mb={5}
                        >
                            Save
                        </Button>
                    </Flex>
                )}
            </Formik>
        </Flex>
    );
};
