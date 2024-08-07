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
} from 'native-base';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import * as ImagePicker from "expo-image-picker";
import * as yup from 'yup';
import { Business } from '../types/Job';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { editService, postService } from '../services/jobServices';
import { ImageBackground, useWindowDimensions } from 'react-native';

const states: string[] = require('../assets/static/states.json');
states.push('Remote (No location)');
type AddServiceFormProps = {
    onCancel: () => void;
    business?: Business;
    mode: 'add' | 'edit';
};

const ServiceSchema = yup.object().shape({
    name: yup.string().required('Required!'),
    address: yup.string().required('Required'),
    link: yup
        .string()
        .matches(
            /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
            'Enter a valid Url'
        ),
    twitter: yup
        .string()
        .matches(
            /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
            'Enter a valid Url'
        ),
    instagram: yup
        .string()
        .matches(
            /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
            'Enter a valid Url'
        ),
    services: yup.array().max(5, 'Max of 5 criteria allowed'),
});

export const AddServiceForm: FC<AddServiceFormProps> = ({ onCancel, business, mode }) => {
    const {width: windowWidth } = useWindowDimensions();
    const { auth } = useAppSelector(({auth})=> ({auth}));
    const toast = useToast()
    const initialValue: Business & { formError?: string, bannerUri?: string; } = business || {
        name: '',
        link: '',
        instagram: '',
        address: '',
        twitter: '',
        services: [],
        bannerUri: '',
        creatorId: auth?.userId || ""
    };
    const pickImageFromGallery = async (callback: (uri: string) => void) => {
        let permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted === false) {
            return;
        }
        try {
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                aspect: [3, 1],
                quality: 0.2,
                allowsEditing: true,
            });
            if(!pickerResult.cancelled) callback(pickerResult.uri)
        } catch (error) {
            console.log({ error });
        } finally {
        }
    };

    return (
        <Flex flex={1}>
            <Formik
                validationSchema={ServiceSchema}
                initialValues={initialValue}
                onSubmit={async (values, { setFieldValue, setSubmitting }) => {
                    const {bannerUri, formError, ...rest} = values;
                    try {
                        if(mode === 'add') {
                            await postService(rest, bannerUri);
                            toast.show({ title: 'Successfully added business'});
                                                    } 
                        if(mode === 'edit') {
                            await editService(rest, bannerUri);
                            toast.show({ title: 'Successfully Edited business'});
                        }
                        setSubmitting(false);
                        onCancel();
                    } catch (error) {
                        const err: any = error;
                        // toast.show({
                        //     title: 'Error Occured',
                        //     description:
                        //         err?.message || "Could not post business, make sure you're connected to the internet",
                        //     status: 'error',
                        // });
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ values, touched, errors, handleChange, handleBlur, isSubmitting, submitForm, setFieldValue }) => (
                    <Flex direction="column" flex={1} mt={5}>
                        <Flex width="100%" height={(windowWidth - 50) * 1/3} position="relative">
                        {values.bannerUrl || values.bannerUri
                         ? <ImageBackground source={{uri: values.bannerUri || values.bannerUrl}} style={{flex: 1}}>
                             <Heading mt='auto' ml={2} mb={2} color="white">Add Business/ Service</Heading>
                         </ImageBackground>: <Heading ml={2} mt="auto" mb={2}>Add Business/ Service</Heading>}
                         <IconButton size="sm" position="absolute" variant="outline" right={5} top={0} icon={<Icon size={5} as = {Entypo} name="edit"/>} onPress = {()=> pickImageFromGallery((uri)=> setFieldValue('bannerUri', uri))} />
                         </Flex>
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
                            isInvalid={!!touched.name && !!errors.name}
                        >
                            <FormControl.Label>Name of Business</FormControl.Label>
                            <Input
                                size="lg"
                                value={values.name}
                                onBlur={handleBlur('name')}
                                onChangeText={handleChange('name')}
                                variant="outline"
                                borderColor="primary.400"
                                placeholder="Eg. Kunlad Properties"
                            />

                            <FormControl.ErrorMessage>{touched.name && errors.name}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            isRequired
                            mb={3}
                            isInvalid={!!touched.address && !!errors.address}
                        >
                            <FormControl.Label>Business Address</FormControl.Label>
                            <Input
                                size="lg"
                                value={values.address}
                                onBlur={handleBlur('address')}
                                onChangeText={handleChange('address')}
                                variant="outline"
                                borderColor="primary.400"
                                placeholder="Eg. House 2 Block L greenview street, Jos"
                            />

                            <FormControl.ErrorMessage>{touched.address && errors.address}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            mb={3}
                            isInvalid={!!touched.twitter && !!errors.twitter}
                        >
                            <FormControl.Label>Twitter page</FormControl.Label>
                            <Input
                                size="lg"
                                value={values.twitter}
                                onBlur={handleBlur('twitter')}
                                onChangeText={handleChange('twitter')}
                                variant="outline"
                                borderColor="primary.400"
                                placeholder="Link to twitter page"
                            />

                            <FormControl.ErrorMessage>{touched.twitter && errors.twitter}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            mb={3}
                            isInvalid={!!touched.instagram && !!errors.instagram}
                        >
                            <FormControl.Label>Instagram</FormControl.Label>
                            <Input
                                size="lg"
                                value={values.instagram}
                                onBlur={handleBlur('instagram')}
                                onChangeText={handleChange('instagram')}
                                variant="outline"
                                borderColor="primary.400"
                                placeholder="Link to instagram page"
                            />

                            <FormControl.ErrorMessage>{touched.instagram && errors.instagram}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>

                        <Flex mb={3}>
                            <FieldArray name="services">
                                {({ remove, push }) => (
                                    <>
                                        <HStack alignItems="center" space={3} mb={3}>
                                            <Heading fontSize="lg">Services Offered</Heading>
                                            <IconButton
                                                variant="solid"
                                                borderRadius="full"
                                                size="md"
                                                icon={<Icon as={AntDesign} name="plus" />}
                                                onPress={() => push('')}
                                            />
                                        </HStack>
                                        {values?.services
                                            ? values.services.map((service, i) => (
                                                  <Flex
                                                      direction="row"
                                                      alignItems="center"
                                                      mt={2}
                                                      key={`services-${i}`}
                                                  >
                                                      <Input
                                                          size="md"
                                                          placeholder="Car cleaning"
                                                          flex={5}
                                                          value={service}
                                                          onChangeText={handleChange(`services.${i}`)}
                                                          variant="outline"
                                                          borderColor="primary.400"
                                                      />
                                                      <IconButton
                                                          onPress={() => remove(i)}
                                                          flex={1}
                                                          color="red.300"
                                                          icon={<Icon color="red.300" as={Entypo} name="cross" />}
                                                      />
                                                  </Flex>
                                              ))
                                            : null}
                                    </>
                                )}
                            </FieldArray>
                            <FormControl isInvalid={!!errors.services}>
                                <FormControl.ErrorMessage>{errors.services}</FormControl.ErrorMessage>
                            </FormControl>
                        </Flex>
                        <FormControl _text={{ fontSize: 'lg' }} mb={5} isInvalid={!!touched.link && !!errors.link}>
                            <FormControl.Label>Business Website</FormControl.Label>
                            <Input
                                size="lg"
                                value={values.link}
                                onBlur={handleBlur('link')}
                                onChangeText={handleChange('link')}
                                variant="outline"
                                borderColor="primary.400"
                                placeholder="Eg. https://jobberman.com/"
                            />

                            <FormControl.ErrorMessage>{touched.link && errors.link}</FormControl.ErrorMessage>
                            <FormControl.HelperText>link should start with 'http' or 'https'</FormControl.HelperText>
                        </FormControl>
                        <Button
                            disabled={isSubmitting}
                            onPress={() => onCancel()}
                            size="lg"
                            variant="outline"
                            colorScheme="primary"
                            mb={3}
                        >
                            Cancel
                        </Button>
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
