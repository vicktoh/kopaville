import React, { FC } from 'react';
import { Formik } from 'formik';
import { Profile } from '../types/Profile';
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
} from 'native-base';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import * as yup from 'yup';
import { updateProfileInfo } from '../services/profileServices';
import { setProfile } from '../reducers/profileSlice';
import { Checklist } from '../types/System';
import { setSystemInfo } from '../reducers/systemSlice';

const states: string[] = require('../assets/static/states.json');

type EditProfileFormProps = {
    onCancel: () => void;
};

type EditFormValuesType = Profile['profile'] & { formError?: string };

const ProfileSchema = yup.object().shape({
    stateOfOrigin: yup.string().required('Required!'),
    servingState: yup.string().required('Required'),
    lga: yup.string().required('Required!'),
    ppa: yup.string().min(6, 'Must be at least 6 characters'),
    bio: yup.string().min(10, 'Must be at least 10 characters').max(200, 'Must be at most 200 characters'),
    dateOfBirth: yup.object().shape({
        day: yup.string().max(2, 'Must be at least two characters').min(2, 'Must be at most two characters'),
        month: yup.string().max(2, 'Must be at least two characters').min(2, 'Must be at most two characters'),
        year: yup.string().max(4, 'Must be at least four characters').min(4, 'Must be at most four characters'),
    }),
});

export const EditProfileForm: FC<EditProfileFormProps> = ({ onCancel }) => {
    const { auth, profile, systemInfo } = useAppSelector(({ auth, profile, systemInfo }) => ({ auth, profile, systemInfo }));
    const dispatch = useAppDispatch();
    const initialValue: EditFormValuesType = profile?.profile || {
        twitter: '',
        instagram: '',
        stateOfOrigin: '',
        dateOfBirth: {
            day: '',
            month: '',
            year: '',
        },
        ppa: '',
        bio: '',
        servingState: '',
        displayAge: false,
    };
    return (
        <Flex flex={1}>
            <Formik
                validationSchema={ProfileSchema}
                initialValues={initialValue}
                onSubmit={async (values, { setFieldValue, setSubmitting }) => {
                    const res = await updateProfileInfo(auth?.userId || '', { profile: values });
                    if (res.status === 'success') {
                        dispatch(setProfile({ ...profile, profile: values }));
                        const {checkList = {}} = systemInfo || {};
                        if(!checkList?.['Complete Profile']){
                            const newChecklist: Checklist = { ...checkList, "Complete Profile":  true}
                            dispatch(setSystemInfo({...systemInfo, checkList: {... newChecklist}}));
                        }
                        onCancel()
                    } else {
                        setFieldValue('formError', res?.message || 'Unexpected Error');
                        setSubmitting(false);
                    }
                }}
            >
                {({
                    values,
                    touched,
                    errors,
                    handleChange,
                    handleBlur,
                    isSubmitting,
                    submitForm,
                    setFieldValue,
                }) => (
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
                            isInvalid={!!touched.stateOfOrigin && !!errors.stateOfOrigin}
                        >
                            <FormControl.Label>state of origin</FormControl.Label>
                            <Select
                                onValueChange={(value) => setFieldValue('stateOfOrigin', value)}
                                _actionSheetContent={{ bg: 'white' }}
                                _selectedItem={{ bg: 'primary.100', color: 'gray.700' }}
                                dropdownIcon={<ChevronDownIcon color="black" />}
                                accessibilityLabel="Choose account type"
                                size="lg"
                                selectedValue={values.stateOfOrigin}
                                variant="outline"
                                borderColor="primary.400"
                            >
                                {states.map((name, i) => (
                                    <Select.Item key={`origin-state-${name}`} value={name} label={name} />
                                ))}
                            </Select>
                            <FormControl.ErrorMessage>
                                {touched.stateOfOrigin && errors.stateOfOrigin}
                            </FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            isRequired
                            mb={3}
                            isInvalid={!!touched.dateOfBirth && !!errors.dateOfBirth}
                        >
                            <FormControl.Label>date of birth (DD - MM - YYYY)</FormControl.Label>
                            <HStack alignItems="center" space={5}>
                                <Input
                                    size="lg"
                                    value={values.dateOfBirth.day}
                                    onBlur={handleBlur('dateOfBirth.day')}
                                    onChangeText={handleChange('dateOfBirth.day')}
                                    variant="outline"
                                    borderColor="primary.400"
                                    placeholder="DD"
                                />
                                <Input
                                    size="lg"
                                    value={values.dateOfBirth.month}
                                    onBlur={handleBlur('dateOfBirth.month')}
                                    onChangeText={handleChange('dateOfBirth.month')}
                                    variant="outline"
                                    borderColor="primary.400"
                                    placeholder="MM"
                                />
                                <Input
                                    size="lg"
                                    value={values.dateOfBirth.year}
                                    onBlur={handleBlur('dateOfBirth.year')}
                                    onChangeText={handleChange('dateOfBirth.year')}
                                    variant="outline"
                                    borderColor="primary.400"
                                    placeholder="YYYY"
                                />
                            </HStack>

                            <FormControl.ErrorMessage>
                                {touched.dateOfBirth?.month && errors.dateOfBirth?.month}
                            </FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            isRequired
                            mb={3}
                            isInvalid={!!touched.displayAge && !!errors.displayAge}
                        >
                            <HStack space={3}>
                                <Checkbox
                                    accessibilityLabel="agree to terms"
                                    value="agreed"
                                    isChecked={values.displayAge}
                                    onChange={(checked) => setFieldValue('displayAge', checked)}
                                />
                                <FormControl.Label>display age publicly</FormControl.Label>
                            </HStack>
                            <FormControl.ErrorMessage>
                                {touched.displayAge && errors.displayAge}
                            </FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            isRequired
                            mb={3}
                            isInvalid={!!touched.servingState && !!errors.servingState}
                            bg="white"
                        >
                            <FormControl.Label>serving state</FormControl.Label>
                            <Select
                                onValueChange={(value) => setFieldValue('servingState', value)}
                                _actionSheetContent={{ bg: 'white' }}
                                _selectedItem={{ bg: 'primary.100', color: 'gray.700' }}
                                dropdownIcon={<ChevronDownIcon color="black" />}
                                accessibilityLabel="Choose account type"
                                size="lg"
                                selectedValue={values.servingState}
                                variant="outline"
                                borderColor="primary.400"
                            >
                                {states.map((name, i) => (
                                    <Select.Item key={`serving-state-${i}`} value={name} label={name} />
                                ))}
                            </Select>
                            <FormControl.ErrorMessage>
                                {touched.servingState && errors.servingState}
                            </FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            isRequired
                            mb={3}
                            isInvalid={!!touched.lga && !!errors.lga}
                        >
                            <FormControl.Label>LGA</FormControl.Label>
                            <Input
                                size="md"
                                value={values.lga}
                                onBlur={handleBlur('lga')}
                                onChangeText={handleChange('lga')}
                                variant="outline"
                                borderColor="primary.400"
                            />
                            <FormControl.ErrorMessage>{touched.lga && errors.lga}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl _text={{ fontSize: 'lg' }} mb={3} isInvalid={!!touched.ppa && !!errors.ppa}>
                            <FormControl.Label>place of Primary Assignment</FormControl.Label>
                            <Input
                                size="md"
                                value={values.ppa}
                                onBlur={handleBlur('ppa')}
                                onChangeText={handleChange('ppa')}
                                variant="outline"
                                borderColor="primary.400"
                            />
                            <FormControl.ErrorMessage>{touched.ppa && errors.ppa}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl _text={{ fontSize: 'lg' }} mb={3} isInvalid={!!touched.bio && !!errors.bio}>
                            <FormControl.Label>bio</FormControl.Label>
                            <TextArea
                                size="lg"
                                value={values.bio}
                                onBlur={handleBlur('bio')}
                                onChangeText={handleChange('bio')}
                                variant="outline"
                                borderColor="primary.400"
                                height={20}
                            />
                            <FormControl.ErrorMessage>{touched.bio && errors.bio}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            mb={3}
                            isInvalid={!!touched.twitter && !!errors.twitter}
                        >
                            <FormControl.Label>twitter link</FormControl.Label>
                            <Input
                                size="md"
                                value={values.twitter}
                                onBlur={handleBlur('twitter')}
                                onChangeText={handleChange('twitter')}
                                variant="outline"
                                borderColor="primary.400"
                            />
                            <FormControl.ErrorMessage>{touched.twitter && errors.twitter}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <FormControl
                            _text={{ fontSize: 'lg' }}
                            mb={3}
                            isInvalid={!!touched.instagram && !!errors.instagram}
                        >
                            <FormControl.Label>instagram link</FormControl.Label>
                            <Input
                                size="md"
                                value={values.instagram}
                                onBlur={handleBlur('instagram')}
                                onChangeText={handleChange('instagram')}
                                variant="outline"
                                borderColor="primary.400"
                            />
                            <FormControl.ErrorMessage>{touched.instagram && errors.instagram}</FormControl.ErrorMessage>
                            <FormControl.HelperText></FormControl.HelperText>
                        </FormControl>
                        <Button onPress={() => onCancel()} size="lg" variant="outline" colorScheme="primary" mb={3}>
                            Cancel
                        </Button>
                        <Button isLoading={isSubmitting}  onPress={() => submitForm()} size="lg" variant="solid" colorScheme="primary" mb={5}>
                            Save
                        </Button>
                    </Flex>
                )}
            </Formik>
        </Flex>
    );
};
