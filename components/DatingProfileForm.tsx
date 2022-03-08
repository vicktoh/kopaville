import React, { FC, useState } from 'react';
import { Business, Education, Profile } from '../types/Profile';
import {
    Button,
    ChevronDownIcon,
    Flex,
    FormControl,
    HStack,
    Icon,
    Image,
    Input,
    Progress,
    Radio,
    Select,
    TextArea,
} from 'native-base';
import { FieldArray, Formik } from 'formik';
import * as yup from 'yup';
import { updateCarrerInfo, updateProfileInfo } from '../services/profileServices';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setProfile } from '../reducers/profileSlice';
import { AntDesign } from '@expo/vector-icons';
type DatingFormProps = {
    onClose: () => void;
    profile?: Partial<Profile['datingProfile']>;
};

const DatingSchema = yup.object().shape({
    profile: yup.string().required('Required !').min(4, 'Requires at least 4 characters'),
    status: yup.string().required('Required !'),
});

export const DatingProfileForm: FC<DatingFormProps> = ({ onClose, profile: datingProfile }) => {
    const initialValues: Profile['datingProfile'] = {
        profile: datingProfile?.profile || '',
        interest: datingProfile?.interest || [],
        status: datingProfile?.status || '',
    };
    const dispatch = useAppDispatch();
    const { auth, profile } = useAppSelector(({ auth, profile }) => ({ auth, profile }));
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [interest, setInterest] = useState<string>('');

    return (
        <Formik
            validationSchema={DatingSchema}
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting, setFieldValue }) => {
                const newDatingProfile = { ...datingProfile, ...values };
                await updateProfileInfo(auth?.userId || '', { datingProfile: { ...newDatingProfile } });
                dispatch(setProfile({ ...profile, datingProfile: { ...newDatingProfile } }));
                onClose();
            }}
        >
            {({ touched, errors, handleBlur, values, submitForm, handleChange, setFieldValue, isSubmitting }) => (
                <Flex direction="column" mt={5}>
                    <FormControl
                        _text={{ fontSize: 'lg' }}
                        isRequired
                        mb={3}
                        isInvalid={!!touched.profile && !!errors.profile}
                    >
                        <FormControl.Label>Dating Profile</FormControl.Label>
                        <TextArea
                            placeholder="About yourself"
                            size="md"
                            value={values?.profile}
                            onBlur={handleBlur('profile')}
                            onChangeText={handleChange('profile')}
                            variant="outline"
                            borderColor="primary.400"
                        />
                        <FormControl.ErrorMessage>{touched.profile && errors.profile}</FormControl.ErrorMessage>
                        <FormControl.HelperText></FormControl.HelperText>
                    </FormControl>
                    <FormControl
                        _text={{ fontSize: 'lg' }}
                        mb={3}
                        isInvalid={!!touched.status && !!errors.status}
                        isRequired
                    >
                        <FormControl.Label>Relationship Status</FormControl.Label>
                        <Flex direction="row">
                            <Radio.Group
                                accessibilityLabel="Relationship Status"
                                name="status"
                                value={values.status}
                                onChange={handleChange('status')}
                            >
                                <Radio value="single" my={1} size="sm">
                                    Single
                                </Radio>
                                <Radio value="married" my={1} size="sm">
                                    Married
                                </Radio>
                                <Radio value="complicated" my={1} size="sm">
                                    It's Complicated
                                </Radio>
                            </Radio.Group>
                        </Flex>

                        <FormControl.ErrorMessage>{touched.status && errors.status}</FormControl.ErrorMessage>
                        <FormControl.HelperText></FormControl.HelperText>
                    </FormControl>
                    <FormControl _text={{ fontSize: 'lg' }} mb={3}>
                        <FormControl.Label>Interests</FormControl.Label>
                        <Flex direction="row">
                            <Input
                                placeholder="Interest E.g Movies"
                                size="md"
                                value={interest}
                                onChangeText={(text) => setInterest(text)}
                                variant="outline"
                                borderColor="primary.400"
                                flex={5}
                                mr={2}
                            />
                            <Button
                                onPress={() => {
                                    if (!interest) return;
                                    const interests = [...(values.interest || [])];
                                    interests.push(interest);
                                    setFieldValue('interest', interests);
                                    setInterest('');
                                }}
                                variant="outline"
                                size="md"
                                flex={2}
                            >
                                Add
                            </Button>
                        </Flex>
                        <FormControl.HelperText></FormControl.HelperText>
                    </FormControl>
                    <Flex direction="row" flexWrap="wrap">
                        <FieldArray name="interest">
                            {({ remove }) =>
                                values?.interest && values.interest.length
                                    ? values.interest.map((int, i) => (
                                          <Button
                                              mt={2}
                                              mr={2}
                                              onPress={() => remove(i)}
                                              bg="secondary.200"
                                              _text={{ color: 'primary.500' }}
                                              key={`interest-${i}`}
                                              leftIcon={<Icon size="xs" as={AntDesign} name="minuscircle" />}
                                          >
                                              {int}
                                          </Button>
                                      ))
                                    : null
                            }
                        </FieldArray>
                    </Flex>

                    <Button
                        disabled={isSubmitting}
                        mt={5}
                        size="lg"
                        variant="outline"
                        onPress={onClose}
                        colorScheme="primary"
                        mb={2}
                    >
                        Cancel
                    </Button>
                    <Button
                        isLoadingText="Updating Profile"
                        isLoading={isSubmitting}
                        mt={2}
                        size="lg"
                        variant="solid"
                        onPress={() => submitForm()}
                        colorScheme="primary"
                        mb={5}
                    >
                        Save
                    </Button>
                </Flex>
            )}
        </Formik>
    );
};
