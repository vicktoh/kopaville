import React, { FC } from 'react';
import { FieldArray, Formik } from 'formik';
import {
    Flex,
    FormControl,
    HStack,
    Input,
    Select,
    Button,
    Alert,
    VStack,
    Box,
    ChevronDownIcon,
    TextArea,
    Heading,
    IconButton,
    Icon,
    useToast,
} from 'native-base';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import * as yup from 'yup';
import { Job } from '../types/Job';
import * as ImagePicker from 'expo-image-picker';

import { AntDesign, Entypo } from '@expo/vector-icons';
import { postJob } from '../services/jobServices';
import { ImageBackground, useWindowDimensions } from 'react-native';

const states: string[] = require('../assets/static/states.json');
states.push("Remote (No location)");
type AddJobFormProps = {
    onCancel: () => void;
    job?: Job;
    mode: 'add' | 'edit';
};

const JobSchema = yup.object().shape({
    title: yup.string().required('Required!'),
    organisation: yup.string().required('Required!'),
    location: yup.string().required('Required'),
    link: yup.string().required('Required!'),
    description: yup.string().required('Required!'),
    criteria: yup.array().min(1, 'Must add at least on criteria').max(5, 'Max of 5 criteria allowed'),
    bannerUrl: yup.string(),
});

export const AddJobForm: FC<AddJobFormProps> = ({ onCancel, job }) => {
    const { auth, profile, systemInfo } = useAppSelector(({ auth, profile, systemInfo }) => ({
        auth,
        profile,
        systemInfo,
    }));
    const {width: windowWidth} = useWindowDimensions();
    const toast = useToast();
    const dispatch = useAppDispatch();
    const initialValue: Job & { formError?: string, bannerUri?: string} = job || {
        title: '',
        description: '',
        link: '',
        criteria: [],
        location: '',
        organisation: '',
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
                validationSchema={JobSchema}
                initialValues={initialValue}
                onSubmit={async (values, { setFieldValue, setSubmitting }) => {
                    try {
                        const {bannerUri, formError, ...rest } = values;
                        await postJob(rest, bannerUri);
                        // toast.show({title: 'Successfully Added post', status: "success"});
                        setSubmitting(false)
                        onCancel();
                    } catch (error) {
                        const err: any = error;
                        toast.show({title:"Error Occured", description: err?.message || "Could not post job, make sure you're connected to the internet", status: 'error'});
                    }
                    finally{
                        setSubmitting(false)
                    }
                }}
            >
                {({ values, touched, errors, handleChange, handleBlur, isSubmitting, submitForm, setFieldValue }) => (
                    <Flex   direction="column" flex={1} mt={5}>
                        <Flex width="100%" height={(windowWidth - 50) * 1/3} position="relative">
                        {values.bannerUrl || values.bannerUri
                         ? <ImageBackground source={{uri: values.bannerUri || values.bannerUrl}} style={{flex: 1}}>
                             <Heading mt='auto' ml={2} mb={2} color="white">Add Job Opening</Heading>
                         </ImageBackground>: <Heading ml={2} mt="auto" mb={2}>Add Job Opening</Heading>}
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
                            isInvalid={!!touched.organisation && !!errors.organisation}
                        >
                            <FormControl.Label>Name of Organisation</FormControl.Label>
                            <Input
                                size="lg"
                                value={values.organisation}
                                onBlur={handleBlur('organisation')}
                                onChangeText={handleChange('organisation')}
                                variant="outline"
                                borderColor="primary.400"
                                placeholder="Eg. Access Bank PLC"
                            />

                            <FormControl.ErrorMessage>
                                {touched.organisation && errors.organisation}
                            </FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            isRequired
                            mb={3}
                            isInvalid={!!touched.title && !!errors.title}
                        >
                            <FormControl.Label>Job title</FormControl.Label>
                            <Input
                                size="lg"
                                value={values.title}
                                onBlur={handleBlur('title')}
                                onChangeText={handleChange('title')}
                                variant="outline"
                                borderColor="primary.400"
                                placeholder="Eg. Executive Assistant"
                            />

                            <FormControl.ErrorMessage>{touched.title && errors.title}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            isRequired
                            mb={3}
                            isInvalid={!!touched.description && !!errors.description}
                        >
                            <FormControl.Label>Job Description</FormControl.Label>
                            <TextArea
                                height={20}
                                size="lg"
                                value={values.description}
                                onBlur={handleBlur('description')}
                                onChangeText={handleChange('description')}
                                variant="outline"
                                borderColor="primary.400"
                                placeholder="Description in 200 character max"
                            />

                            <FormControl.ErrorMessage>
                                {touched.description && errors.description}
                            </FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            isRequired
                            mb={3}
                            isInvalid={!!touched.location && !!errors.location}
                        >
                            <FormControl.Label>Location</FormControl.Label>
                            <Select
                                onValueChange={(value) => setFieldValue('location', value)}
                                _actionSheetContent={{ bg: 'white' }}
                                _selectedItem={{ bg: 'primary.100', color: 'gray.700' }}
                                dropdownIcon={<ChevronDownIcon color="black" />}
                                accessibilityLabel="Choose account type"
                                size="lg"
                                selectedValue={values.location}
                                variant="outline"
                                borderColor="primary.400"
                            >
                                {states.map((name, i) => (
                                    <Select.Item key={`job-location-${i}`} value={name} label={name} />
                                ))}
                            </Select>
                            <FormControl.ErrorMessage>{touched.location && errors.location}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>

                        <Flex mb = {3}>
                            <FieldArray name="criteria">
                                {({ remove, push }) => (
                                    <>
                                        <HStack alignItems="center" space={3} mb={3}>
                                            <Heading fontSize="lg">Job Requirements / Criteria</Heading>
                                            <IconButton variant="solid" borderRadius="full" size="md" icon={<Icon as={AntDesign} name="plus" />} onPress={()=> push('')} />
                                        </HStack>
                                        {values.criteria.map((cri, i) => (
                                            <Flex direction="row" alignItems="center" mt={2} key = {`criteria-${i}`}>
                                                <Input
                                                    size = "md"
                                                    placeholder='Eg. Knowlege of MS word'
                                                    flex={5}
                                                    value={values.criteria[i]}
                                                    onChangeText={handleChange(`criteria.${i}`)}
                                                    variant="outline"
                                                    borderColor="primary.400"
                                                />
                                                <IconButton
                                                    onPress={() => remove(i) }
                                                    flex={1}
                                                    color="red.300"
                                                    icon={<Icon color="red.300" as={Entypo} name="cross" />}
                                                />
                                            </Flex>
                                        ))}
                                    </>
                                )}
                            </FieldArray>
                            <FormControl isInvalid={!!errors.criteria}>
                                <FormControl.ErrorMessage>{errors.criteria}</FormControl.ErrorMessage>
                            </FormControl>
                        </Flex>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            isRequired
                            mb={5}
                            isInvalid={!!touched.title && !!errors.title}
                        >
                            <FormControl.Label>Application Link</FormControl.Label>
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
                        <Button disabled={isSubmitting} onPress={() => onCancel()} size="lg" variant="outline" colorScheme="primary" mb={3}>
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
