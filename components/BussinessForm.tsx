import React, { FC, useState } from 'react';
import { Business, Education, Profile } from '../types/Profile';
import { Button, Flex, FormControl, HStack, Image, Input, Progress, TextArea } from 'native-base';
import { Formik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import * as yup from 'yup';
import { updateCarrerInfo, updateProfileInfo } from '../services/profileServices';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setProfile } from '../reducers/profileSlice';
type BussinessFormProps = {
    onClose: () => void;
    business?: Business;
    mode: 'add' | 'edit', 
    index?: number;
};

const BussinessSchema = yup.object().shape({
    name: yup.string().required('Required !').min(4, 'Requires at least 4 characters'),
    link: yup.string().matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Enter correct url!'
    ),
    twitter: yup.string().matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Enter correct url!'
    ),
    instagram: yup.string().matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Enter correct url!'
    )
});

export const BussinessForm: FC<BussinessFormProps> = ({ onClose, business, mode, index }) => {
    const initialValues: Business = {
        name: business?.name || '',
        link: business?.link || '',
        instagram: business?.instagram || '',
        twitter: business?.twitter || ''
    };
    const dispatch = useAppDispatch();
    const { auth, profile } = useAppSelector(({ auth, profile }) => ({ auth, profile }));
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    
    const deleteBusiness = async(index: number) =>{
        const copyofBusiness = [...profile?.careerProfile?.business || []];
        copyofBusiness.splice(index, 1);
        setIsDeleting(true)
        await updateProfileInfo(auth?.userId || "", { careerProfile: { business: copyofBusiness}});
        dispatch(setProfile({...profile, careerProfile : {...profile?.careerProfile, business: copyofBusiness}}));
        setIsDeleting(false);
        onClose();

    }

    return (
        <Formik
            validationSchema={BussinessSchema}
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting, setFieldValue }) => {
                if(mode === "add"){
                    const newCarrer: Profile["careerProfile"] =  { ...(profile?.careerProfile || {}), business: [...(profile?.careerProfile?.business || []), values]}
                    await updateProfileInfo(auth?.userId || "", {careerProfile: {...newCarrer}});
                    dispatch(setProfile({...profile, careerProfile: {...newCarrer}}))
                }

                if(mode === "edit" &&  index !== undefined){
                    const copyofBusiness = [...(profile?.careerProfile?.business || [])]
                    copyofBusiness.splice(index, 1, values);
                    await updateProfileInfo(auth?.userId || "", {careerProfile: {business: copyofBusiness}});
                    dispatch(setProfile({...profile, careerProfile: {...profile?.careerProfile, business: copyofBusiness}}));
                }

                onClose()

                
            }}
        >
            {({ touched, errors, handleBlur, values, submitForm, handleChange, setFieldValue, isSubmitting }) => (
                <Flex direction="column" mt={5}>
                    <FormControl
                        _text={{ fontSize: 'lg' }}
                        isRequired
                        mb={3}
                        isInvalid={!!touched.name && !!errors.name}
                    >
                        <FormControl.Label>Name of Business</FormControl.Label>
                        <Input
                            placeholder='Business Name'
                            size="md"
                            value={values.name}
                            onBlur={handleBlur('name')}
                            onChangeText={handleChange('name')}
                            variant="outline"
                            borderColor="primary.400"
                        />
                        <FormControl.ErrorMessage>{touched.name && errors.name}</FormControl.ErrorMessage>
                        <FormControl.HelperText></FormControl.HelperText>
                    </FormControl>
                    <FormControl
                        _text={{ fontSize: 'lg' }}
                        mb={3}
                        isInvalid={!!touched.link && !!errors.link}
                    >
                        <FormControl.Label>Website</FormControl.Label>
                        <Input
                            placeholder='Business Website'
                            size="md"
                            value={values.link}
                            onBlur={handleBlur('link')}
                            onChangeText={handleChange('link')}
                            variant="outline"
                            borderColor="primary.400"
                        />
                        <FormControl.ErrorMessage>{touched.link && errors.link}</FormControl.ErrorMessage>
                        <FormControl.HelperText></FormControl.HelperText>
                    </FormControl>
                    <FormControl
                        _text={{ fontSize: 'lg' }}
                        mb={3}
                        isInvalid={!!touched.instagram && !!errors.instagram}
                    >
                        <FormControl.Label>Instagram link</FormControl.Label>
                        <Input
                            placeholder='Instagram link'
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
                    <FormControl
                        _text={{ fontSize: 'lg' }}
                        mb={3}
                        isInvalid={!!touched.twitter && !!errors.twitter}
                    >
                        <FormControl.Label>Twitter link</FormControl.Label>
                        <Input
                            placeholder='Twitter page'
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
                    {
                        mode ==="edit" ? 
                        <Button my={2} isLoading={isDeleting} isLoadingText="Removing Education" variant="outline" colorScheme="red" onPress={()=> index !==undefined &&  deleteBusiness(index)}>
                            Delete
                        </Button>:
                        null
                    }
                    <Button
                        isLoadingText="Updating Business"
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
