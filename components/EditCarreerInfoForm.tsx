import React, { FC } from 'react';
import { Profile } from '../types/Profile';
import { Button, Flex, FormControl, Image, Input, Progress, Text, TextArea } from 'native-base';
import { Formik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from "expo-document-picker";
import * as yup from 'yup';
import { updateCareerInfo } from '../services/profileServices';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setProfile } from '../reducers/profileSlice';
import { setSystemInfo } from '../reducers/systemSlice';
import { Checklist } from '../types/System';
type EditCarreerInfoFormProps = {
    onClose: () => void;
    carreerProfile: Profile['careerProfile'];
};

const CarreerProfileSchema = yup.object().shape({
    profile: yup.string().required('Required !').min(20, 'Requires at least 20 characters'),
});

export const EditCarreerInfoForm: FC<EditCarreerInfoFormProps> = ({ onClose, carreerProfile }) => {
    const initialValues: Partial<Profile['careerProfile']> & {
        cvResult?: DocumentPicker.DocumentResult;
        uploadProgress: 0;
    } = {
        profile: carreerProfile?.profile || '',
        cvUrl: carreerProfile?.cvUrl || '',
        uploadProgress: 0,
    };
    const dispatch = useAppDispatch();
    const { auth, profile, systemInfo } = useAppSelector(({ auth, profile, systemInfo }) => ({ auth, profile, systemInfo }));

    const pickDocument = async (callback: (result: DocumentPicker.DocumentResult) => void) => {
        try {
            const documentResult = await DocumentPicker.getDocumentAsync({type: 'application/pdf'});
            if (documentResult.type === "cancel") {
                return;
            }

            callback(documentResult);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Formik
            validationSchema={CarreerProfileSchema}
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting, setFieldValue }) => {
                const profileData = {
                    profile: values.profile || '',
                    ...(values.cvResult?.type === 'cancel' ? {} : { uri: values.cvResult?.uri }),
                };
                await updateCareerInfo(
                    auth?.userId || '',
                    profileData,
                    (data: { profile: string; cvUrl?: string }) => {
                        dispatch(setProfile({ ...profile, careerProfile: { ...profile?.careerProfile, ...data } }));
                        setSubmitting(false);
                        onClose();
                        const { checkList = {}} = systemInfo || {};
                        if(!checkList?.['Complete Career Profile']){
                            const newChecklist: Checklist = { ...checkList, 'Complete Career Profile' :  true}
                            dispatch(setSystemInfo({...systemInfo, checkList: {... newChecklist}}));
                        }
                    }
                );
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
                        <FormControl.Label>Career Profile</FormControl.Label>
                        <TextArea
                            height={20}
                            size="md"
                            value={values.profile}
                            onBlur={handleBlur('profile')}
                            onChangeText={handleChange('profile')}
                            variant="outline"
                            borderColor="primary.400"
                        />
                        <FormControl.ErrorMessage>{touched.profile && errors.profile}</FormControl.ErrorMessage>
                        <FormControl.HelperText></FormControl.HelperText>
                    </FormControl>
                    <Button
                        variant=""
                        bg="secondary.100"
                        _text={{ color: 'primary.500' }}
                        onPress={() => pickDocument((result) => setFieldValue('cvResult', result))}
                    >
                        Select Resume
                    </Button>
                    <Flex>
                        {values?.cvResult && values.cvResult.type === 'success' && (
                            <Flex>
                                <Text isTruncated={true} noOfLines={2}>{values.cvResult.name}</Text>
                            </Flex>
                        )}
                    </Flex>
    
                    <Button
                        disabled={isSubmitting}
                        mt={5}
                        size="lg"
                        variant="outline"
                        colorScheme="primary"
                        onPress={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        isLoadingText="Updating Career"
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
