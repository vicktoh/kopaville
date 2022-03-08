import React, { FC, useState } from 'react';
import { Education, Profile } from '../types/Profile';
import { Button, Flex, FormControl, HStack, Input } from 'native-base';
import { Formik } from 'formik';
import * as yup from 'yup';
import { updateProfileInfo } from '../services/profileServices';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setProfile } from '../reducers/profileSlice';
type EducationFormProps = {
    onClose: () => void;
    education?: Education;
    mode: 'add' | 'edit';
    index?: number;
};

const EducationSchema = yup.object().shape({
    institution: yup.string().required('Required !').min(4, 'Requires at least 4 characters'),
    qualification: yup.string().required('Required !').min(4, 'Requires at least 4 characters'),
    period: yup.object().shape({
        start: yup.string().required('Required !').max(4, 'Use only year e.g 2014').min(4, 'Use only year eg.2021'),
        end: yup.string().required('Required !').max(4, 'Use only year e.g 2014').min(4, 'Use only year eg.2021'),
    }),
});

export const EducationForm: FC<EducationFormProps> = ({ onClose, education, mode, index }) => {
    const initialValues: Education = {
        institution: education?.institution || '',
        qualification: education?.qualification || '',
        period: { start: education?.period.start || '', end: education?.period.end || '' },
    };
    const dispatch = useAppDispatch();
    const { auth, profile } = useAppSelector(({ auth, profile }) => ({ auth, profile }));
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const deleteEducation = async (index: number) =>{
        const copyOfEducation = [...profile?.careerProfile?.education || []];
        copyOfEducation.splice(index, 1);
        setIsDeleting(true)
        await updateProfileInfo(auth?.userId || "", { careerProfile: { education: copyOfEducation}});
        dispatch(setProfile({...profile, careerProfile : {...profile?.careerProfile, education: copyOfEducation}}));
        setIsDeleting(false);
        onClose();

    }
    return (
        <Formik
            validationSchema={EducationSchema}
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting, setFieldValue }) => {
                if (mode === 'add') {
                    const newCarrer: Profile['careerProfile'] = {
                        ...(profile?.careerProfile || {}),
                        education: [...(profile?.careerProfile?.education || []), values],
                    };
                    await updateProfileInfo(auth?.userId || '', { careerProfile: { ...newCarrer } });
                    dispatch(setProfile({ ...profile, careerProfile: { ...newCarrer } }));
                }

                if (mode === 'edit' && index !== undefined) {
                    const copyOfEducation = [...(profile?.careerProfile?.education || [])];
                    copyOfEducation.splice(index, 1, values);
                    await updateProfileInfo(auth?.userId || '', { careerProfile: { education: copyOfEducation } });
                    dispatch(
                        setProfile({
                            ...profile,
                            careerProfile: { ...profile?.careerProfile, education: copyOfEducation },
                        })
                    );
                }

                onClose();
            }}
        >
            {({ touched, errors, handleBlur, values, submitForm, handleChange, setFieldValue, isSubmitting }) => (
                <Flex direction="column" mt={5}>
                    <FormControl
                        _text={{ fontSize: 'lg' }}
                        isRequired
                        mb={3}
                        isInvalid={!!touched.institution && !!errors.institution}
                    >
                        <FormControl.Label>Institution</FormControl.Label>
                        <Input
                            placeholder="Institution of Learing"
                            size="md"
                            value={values.institution}
                            onBlur={handleBlur('institution')}
                            onChangeText={handleChange('institution')}
                            variant="outline"
                            borderColor="primary.400"
                        />
                        <FormControl.ErrorMessage>{touched.institution && errors.institution}</FormControl.ErrorMessage>
                        <FormControl.HelperText></FormControl.HelperText>
                    </FormControl>
                    <FormControl
                        _text={{ fontSize: 'lg' }}
                        isRequired
                        mb={3}
                        isInvalid={!!touched.institution && !!errors.institution}
                    >
                        <FormControl.Label>Qualification</FormControl.Label>
                        <Input
                            placeholder="eg. BSC, MSC Computer Science "
                            size="md"
                            value={values.qualification}
                            onBlur={handleBlur('qualification')}
                            onChangeText={handleChange('qualification')}
                            variant="outline"
                            borderColor="primary.400"
                        />
                        <FormControl.ErrorMessage>
                            {touched.qualification && errors.qualification}
                        </FormControl.ErrorMessage>
                        <FormControl.HelperText></FormControl.HelperText>
                    </FormControl>
                    <FormControl
                        _text={{ fontSize: 'lg' }}
                        isRequired
                        mb={3}
                        isInvalid={!!touched.period && !!errors.period}
                    >
                        <FormControl.Label>Period</FormControl.Label>
                        <HStack space={5}>
                            <Input
                                minWidth={100}
                                placeholder="Start year"
                                size="md"
                                value={values.period.start}
                                onBlur={handleBlur('period.start')}
                                onChangeText={handleChange('period.start')}
                                variant="outline"
                                borderColor="primary.400"
                            />
                            <Input
                                minWidth={100}
                                placeholder="End year"
                                size="md"
                                value={values.period.end}
                                onBlur={handleBlur('period.end')}
                                onChangeText={handleChange('period.end')}
                                variant="outline"
                                borderColor="primary.400"
                            />
                        </HStack>

                        <FormControl.ErrorMessage>
                            {(touched.period?.start && errors.period?.start) ||
                                (touched.period?.end && errors.period?.end)}
                        </FormControl.ErrorMessage>
                        <FormControl.HelperText></FormControl.HelperText>
                    </FormControl>

                    <Button
                        disabled={isSubmitting || isDeleting}
                        mt={5}
                        size="lg"
                        variant="outline"
                        colorScheme="primary"
                        onPress={onClose}
                    >
                        Cancel
                    </Button>
                    {
                        mode ==="edit" ? 
                        <Button my={2} isLoading={isDeleting} isLoadingText="Removing Education" variant="outline" colorScheme="red" onPress={()=> index !==undefined &&  deleteEducation(index)}>
                            Delete
                        </Button>:
                        null
                    }
                    <Button
                        isLoadingText="Updating Education"
                        disabled={isSubmitting || isDeleting}
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
