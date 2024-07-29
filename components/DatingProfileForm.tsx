import React, { FC, useState } from 'react';
import { Business, Education, Gender, GenoType, Profile, RelationshipStatus } from '../types/Profile';
import {
    Button,
    Checkbox,
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
import {
    updateCareerInfo,
    updateProfileInfo,
} from '../services/profileServices';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setProfile } from '../reducers/profileSlice';
import { AntDesign } from '@expo/vector-icons';
import { Checklist } from '../types/System';
import { setSystemInfo } from '../reducers/systemSlice';
type DatingFormProps = {
    onClose: () => void;
    profile?: Partial<Profile['datingProfile']>;
};

const DatingSchema = yup.object().shape({
    profile: yup
        .string()
        .required('Required !')
        .min(4, 'Requires at least 4 characters'),
    status: yup.string().required('Required !'),
    alias: yup.string().required('Required !'),
});

export const DatingProfileForm: FC<DatingFormProps> = ({
    onClose,
    profile: datingProfile,
}) => {
    const initialValues: Profile['datingProfile'] = {
        profile: datingProfile?.profile || '',
        interest: datingProfile?.interest || [],
        status: datingProfile?.status || RelationshipStatus.single,
        alias: datingProfile?.alias || '',
        currentCity: datingProfile?.currentCity || '',
        bloodGroup: datingProfile?.bloodGroup || '',
        genotype: datingProfile?.genotype || GenoType.AA,
        showBloodGroup: datingProfile?.showBloodGroup || false,
        smoking: datingProfile?.smoking || false,
        kids: datingProfile?.kids || false,
        noOfKids: datingProfile?.noOfKids || '',
        drinking: datingProfile?.drinking || false,
    };
    const dispatch = useAppDispatch();
    const { auth, profile, systemInfo } = useAppSelector(
        ({ auth, profile, systemInfo }) => ({ auth, profile, systemInfo })
    );
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [interest, setInterest] = useState<string>('');

    return (
        <Formik
            validationSchema={DatingSchema}
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting, setFieldValue }) => {
                const newDatingProfile = { ...datingProfile, ...values };
                await updateProfileInfo(auth?.userId || '', {
                    datingProfile: { ...newDatingProfile },
                });
                dispatch(
                    setProfile({
                        ...profile,
                        datingProfile: { ...newDatingProfile },
                    })
                );
                let { checkList = {} } = systemInfo || {};
                if (!checkList?.['Complete Dating Profile']) {
                    const newChecklist: Checklist = {
                        ...(checkList || {}),
                        'Complete Dating Profile': true,
                    };
                    dispatch(
                        setSystemInfo({
                            ...systemInfo,
                            checkList: { ...newChecklist },
                        })
                    );
                }
                onClose();
            }}
        >
            {({
                touched,
                errors,
                handleBlur,
                values,
                submitForm,
                handleChange,
                setFieldValue,
                isSubmitting,
            }) => (
                <Flex direction="column" mt={5}>
                    <FormControl
                        _text={{ fontSize: 'lg' }}
                        isRequired
                        mb={3}
                        isInvalid={!!touched.alias && !!errors.alias}
                    >
                        <FormControl.Label>Dating Alias</FormControl.Label>
                        <Input
                            placeholder="Eg. Candy"
                            size="md"
                            value={values.alias}
                            onBlur={handleBlur('alias')}
                            onChangeText={handleChange('alias')}
                            variant="outline"
                            borderColor="primary.400"
                            flex={5}
                            mr={2}
                        />
                        <FormControl.ErrorMessage>
                            {touched.alias && errors.alias}
                        </FormControl.ErrorMessage>
                        <FormControl.HelperText></FormControl.HelperText>
                    </FormControl>
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
                            autoCompleteType=""
                        />
                        <FormControl.ErrorMessage>
                            {touched.profile && errors.profile}
                        </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl
                        _text={{ fontSize: 'lg' }}
                        mb={3}
                        isInvalid={!!touched.status && !!errors.status}
                        isRequired
                    >
                        <FormControl.Label>
                            Relationship Status
                        </FormControl.Label>
                        <Flex direction="row">
                            <Radio.Group
                                accessibilityLabel="Relationship Status"
                                name="status"
                                value={values.status}
                                onChange={handleChange('status')}
                            >
                                {Object.keys(RelationshipStatus).map(
                                    (value) => (
                                        <Radio
                                            key={`relationship-status-${value}`}
                                            value={value}
                                            my={1}
                                            size="sm"
                                        >
                                            {value}
                                        </Radio>
                                    )
                                )}
                            </Radio.Group>
                        </Flex>

                        <FormControl.ErrorMessage>
                            {touched.status && errors.status}
                        </FormControl.ErrorMessage>
                        <FormControl.HelperText></FormControl.HelperText>
                    </FormControl>
                    <FormControl
                        _text={{ fontSize: 'lg' }}
                        isRequired
                        mb={3}
                        isInvalid={
                            !!touched.currentCity && !!errors.currentCity
                        }
                    >
                        <FormControl.Label>Current City</FormControl.Label>
                        <Input
                            placeholder="Eg. Warri"
                            size="md"
                            value={values.currentCity}
                            onBlur={handleBlur('currentCity')}
                            onChangeText={handleChange('currentCity')}
                            variant="outline"
                            borderColor="primary.400"
                            flex={5}
                            mr={2}
                        />
                        <FormControl.ErrorMessage>
                            {touched.currentCity && errors.currentCity}
                        </FormControl.ErrorMessage>
                        <FormControl.HelperText></FormControl.HelperText>
                    </FormControl>
                    <Flex direction="row" justifyContent="space-between">
                        <HStack space={3} alignItems="center">
                            <Checkbox
                                accessibilityLabel="smoking"
                                value="smoking"
                                isChecked={values.smoking}
                                onChange={(checked) =>
                                    setFieldValue('smoking', checked)
                                }
                            />
                            <FormControl.Label>🚬Smoke?</FormControl.Label>
                        </HStack>
                        <HStack ml={2} space={3} alignItems="center">
                            <Checkbox
                                accessibilityLabel="Kids"
                                value="agreed"
                                isChecked={values.drinking}
                                onChange={(checked) =>
                                    setFieldValue('drinking', checked)
                                }
                            />
                            <FormControl.Label>
                                🥃Consume Alcohol?
                            </FormControl.Label>
                        </HStack>
                    </Flex>
                    <HStack space={3} mt={5} mb={3}>
                        <Checkbox
                            accessibilityLabel="have kids"
                            value="agreed"
                            isChecked={values.kids}
                            onChange={(checked) =>
                                setFieldValue('kids', checked)
                            }
                        />
                        <FormControl.Label>Have Kids ?</FormControl.Label>
                    </HStack>
                    <FormControl
                        _text={{ fontSize: 'lg' }}
                        isInvalid={!!touched.noOfKids && !!errors.noOfKids}
                    >
                        <FormControl.Label>Number of Kids</FormControl.Label>
                        <Input
                            keyboardType="numeric"
                            size="md"
                            value={values.noOfKids || ''}
                            onBlur={handleBlur('noOfKids')}
                            onChangeText={handleChange('noOfKids')}
                            variant="outline"
                            borderColor="primary.400"
                        />
                        <FormControl.ErrorMessage>
                            {touched.noOfKids && errors.noOfKids}
                        </FormControl.ErrorMessage>
                        <FormControl.HelperText></FormControl.HelperText>
                    </FormControl>

                    <FormControl
                        _text={{ fontSize: 'lg' }}
                        mb={3}
                        isInvalid={!!touched.bloodGroup && !!errors.bloodGroup}
                    >
                        <FormControl.Label>Blood Group</FormControl.Label>
                        <Input
                            placeholder="O +"
                            size="md"
                            value={values.bloodGroup}
                            onBlur={handleBlur('bloodGroup')}
                            onChangeText={handleChange('bloodGroup')}
                            variant="outline"
                            borderColor="primary.400"
                            flex={5}
                            mr={2}
                        />
                        <FormControl.ErrorMessage>
                            {touched.bloodGroup && errors.bloodGroup}
                        </FormControl.ErrorMessage>
                        <FormControl.HelperText></FormControl.HelperText>
                    </FormControl>
                    <FormControl
                        _text={{ fontSize: 'lg' }}
                        mb={3}
                        isInvalid={!!touched.genotype && !!errors.genotype}
                    >
                        <FormControl.Label>Genotype</FormControl.Label>
                        <Select placeholder="AA"  variant="outline" selectedValue = {values.genotype} onValueChange={handleChange('genotype')}>
                            {
                                Object.keys(GenoType).map((value)=> (
                                    <Select.Item value={value} label={value} key={`genetype-${value}`} />
                                ))
                            }
                        </Select>
                        <FormControl.ErrorMessage>
                            {touched.genotype && errors.genotype}
                        </FormControl.ErrorMessage>
                        <FormControl.HelperText></FormControl.HelperText>
                    </FormControl>
                    <FormControl
                        _text={{ fontSize: 'lg' }}
                        mb={3}
                        isInvalid={
                            !!touched.showBloodGroup && !!errors.showBloodGroup
                        }
                    >
                        <HStack space={3}>
                            <Checkbox
                                accessibilityLabel="display genotype and blood group"
                                value="Show blood group and genotype publicly?"
                                isChecked={values.showBloodGroup}
                                onChange={(checked) =>
                                    setFieldValue('showBloodGroup', checked)
                                }
                            />
                            <FormControl.Label>
                                display blood group and genotype publicly?
                            </FormControl.Label>
                        </HStack>
                        <FormControl.ErrorMessage>
                            {touched.showBloodGroup && errors.showBloodGroup}
                        </FormControl.ErrorMessage>
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
                                    const interests = [
                                        ...(values.interest || []),
                                    ];
                                    interests.push(interest);
                                    setFieldValue('interest', interests);
                                    setInterest('');
                                }}
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
                                              leftIcon={
                                                  <Icon
                                                      size="xs"
                                                      as={AntDesign}
                                                      name="minuscircle"
                                                  />
                                              }
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
                        mb={3}
                    >
                        Save
                    </Button>
                </Flex>
            )}
        </Formik>
    );
};
