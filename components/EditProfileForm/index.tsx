import React, { FC } from 'react';
import { Formik } from 'formik';
import { Profile } from '../../types/Profile';
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
    Checkbox,
    ChevronDownIcon,
    TextArea,
    Heading,
    IconButton,
    ChevronLeftIcon,
    ChevronRightIcon,
    Text,
} from 'native-base';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import * as yup from 'yup';
import { updateProfileInfo } from '../../services/profileServices';
import { setProfile } from '../../reducers/profileSlice';
import { Checklist } from '../../types/System';
import { setSystemInfo } from '../../reducers/systemSlice';
import GeneralInfoForm from './GeneralInfoForm';
import ServiceInfo from './ServiceInfo';
import { ContactInfoForm } from './ContactInfoForm';

type EditProfileFormProps = {
    onCancel: () => void;
};

export type EditFormValuesType = Profile['profile'] & {
    formError?: string;
    step?: number;
    languageInput?: string;
};

const ProfileSchema = yup.object().shape({
    stateOfOrigin: yup.string().required('Required!'),
    servingState: yup.string().required('Required'),
    lga: yup.string().required('Required!'),
    corperStatus: yup.string().required("Required!"),
    servingLGA: yup.string().min(5, 'Must be at least 5'),
    ppa: yup.string().min(6, 'Must be at least 6 characters'),
    bio: yup
        .string()
        .min(10, 'Must be at least 10 characters')
        .max(200, 'Must be at most 200 characters'),
        dateOfBirthTimestamp: yup.number().required("Date of bith is required!"),
    
    instagram: yup.string().matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Enter correct url!'
    ),
twitter: yup.string().matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Enter correct url!'
    ),
    
});

export const EditProfileForm: FC<EditProfileFormProps> = ({ onCancel }) => {
    const { auth, profile, systemInfo } = useAppSelector(
        ({ auth, profile, systemInfo }) => ({ auth, profile, systemInfo })
    );
    const dispatch = useAppDispatch();
    const initialValue: EditFormValuesType = profile?.profile || {
        twitter: '',
        instagram: '',
        stateOfOrigin: '',
       
        step: 1,
        ppa: '',
        bio: '',
        servingState: '',
        servingLGA: '',
        displayAge: false,
        displayPhoneNumber: false,
        languages: [],
        languageInput: ''
    };

    const getFormTitle = (step: number) => {
        switch (step) {
            case 1:
                return 'General Info';
            case 2:
                return 'Service Info';
            case 3:
                return 'Other Info';
            default:
                break;
        }
    };
    const getForm = (step: number) => {
        switch (step) {
            case 1:
                return <GeneralInfoForm />;
            case 2:
                return <ServiceInfo />;
            case 3:
                return <ContactInfoForm />;
            default:
                break;
        }
    };
    return (
        <Flex flex={1}>
            <Formik
                validationSchema={ProfileSchema}
                initialValues={initialValue}
                onSubmit={async (values, { setFieldValue, setSubmitting }) => {
                    const { step, formError, languageInput, ...rest} = values;
                    const res = await updateProfileInfo(auth?.userId || '', {
                        profile: {
                            ...rest,
                            dateOfBirthTimestamp: values.dateOfBirthTimestamp,
                        },
                    });
                    if (res.status === 'success') {
                        dispatch(
                            setProfile({
                                ...profile,
                                profile: {
                                    ...values,
                                    dateOfBirthTimestamp: values.dateOfBirthTimestamp
                                    ,
                                },
                            })
                        );
                        const { checkList = {} } = systemInfo || {};
                        if (!checkList?.['Complete Profile']) {
                            const newChecklist: Checklist = {
                                ...checkList,
                                'Complete Profile': true,
                            };
                            dispatch(
                                setSystemInfo({
                                    ...systemInfo,
                                    checkList: { ...newChecklist },
                                })
                            );
                        }
                        onCancel();
                    } else {
                        setFieldValue(
                            'formError',
                            res?.message || 'Unexpected Error'
                        );
                        setSubmitting(false);
                    }
                }}
            >
                {({
                    values,
                    touched,
                    isValid,
                    errors,
                    
                    isSubmitting,
                    submitForm,
                    setFieldValue,
                }) => (
                    <Flex direction="column" flex={1} mt={5}>
                        {errors?.formError ? (
                            <Alert
                                w="100%"
                                status="error"
                                variant="subtle"
                                mb={5}
                            >
                                <VStack space={2} flexShrink={1} w="100%">
                                    <HStack space={3}>
                                        <Alert.Icon mt="1" alignSelf="center" />
                                        <Box fontSize="md">
                                            {errors?.formError}
                                        </Box>
                                    </HStack>
                                </VStack>
                            </Alert>
                        ) : null}

                        <Flex
                            direction="row"
                            mb={5}
                            alignItems="center"
                            mt={3}
                            justifyContent="space-between"
                        >
                            <Heading fontSize="md">
                                {getFormTitle(values.step || 1)}
                            </Heading>
                            <VStack alignItems="center">
                                <Text fontSize="xs">{`${
                                    values.step || 1
                                } of 3`}</Text>
                                <HStack space={3}>
                                    <IconButton
                                        variant="outline"
                                        colorScheme="primary"
                                        size="sm"
                                        onPress={() =>
                                            setFieldValue(
                                                'step',
                                                (values.step || 1) - 1
                                            )
                                        }
                                        disabled={(values.step || 1) <= 1}
                                        icon={<ChevronLeftIcon />}
                                    />
                                    <IconButton
                                        variant="outline"
                                        colorScheme="primary"
                                        size="sm"
                                        onPress={() =>
                                            setFieldValue(
                                                'step',
                                                (values.step || 1) + 1
                                            )
                                        }
                                        disabled={(values.step || 1) >= 3}
                                        icon={<ChevronRightIcon />}
                                    />
                                </HStack>
                            </VStack>
                        </Flex>

                        {getForm(values.step || 1)}
                        {isValid ? <Button
                            isLoading={isSubmitting}
                            onPress={() => submitForm()}
                            size="lg"
                            variant="solid"
                            colorScheme="primary"
                            my={5}
                            disabled={!isValid}
                        >
                            Save
                        </Button>: null}
                        <Button
                            onPress={() => onCancel()}
                            size="lg"
                            variant="ghoost"
                            colorScheme="primary"
                            mb={3}
                        >
                            Cancel
                        </Button>
                    </Flex>
                )}
            </Formik>
        </Flex>
    );
};
