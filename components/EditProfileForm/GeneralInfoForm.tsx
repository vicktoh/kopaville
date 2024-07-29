import { useFormikContext } from 'formik';
import {
    Button,
    Checkbox,
    ChevronDownIcon,
    Flex,
    FormControl,
    HStack,
    Input,
    Select,
    TextArea,
} from 'native-base';
import React, { useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { EditFormValuesType } from '.';
const states: string[] = require('../../assets/static/states.json');
import DatePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { date } from 'yup';
import { format } from 'date-fns';
const GeneralInfoForm = () => {
    const {
        values,
        touched,
        errors,
        isValid,
        setFieldValue,
        handleBlur,
        handleChange,
        handleSubmit,
    } = useFormikContext<EditFormValuesType>();
    const { width: WINDO_WIDTH } = useWindowDimensions();
    const [showDatePicker, setShowDatePicker] = useState(false)
     console.log(values.dateOfBirthTimestamp, "🌹")
    return (
        <>
            <FormControl
                _text={{ fontSize: 'lg' }}
                mb={3}
                isInvalid={!!touched.bio && !!errors.bio}
            >
                <FormControl.Label>bio</FormControl.Label>
                <TextArea
                    size="lg"
                    value={values.bio}
                    onBlur={handleBlur('bio')}
                    onChangeText={handleChange('bio')}
                    variant="outline"
                    borderColor="primary.400"
                    height={20}
                    autoCompleteType
                />
                <FormControl.ErrorMessage>
                    {touched.bio && errors.bio}
                </FormControl.ErrorMessage>
                <FormControl.HelperText></FormControl.HelperText>
            </FormControl>
            <FormControl
                _text={{ fontSize: 'lg' }}
                isRequired
                mb={3}
                isInvalid={!!touched.stateOfOrigin && !!errors.stateOfOrigin}
            >
                <FormControl.Label>state of origin</FormControl.Label>
                <Select
                    onValueChange={(value) =>
                        setFieldValue('stateOfOrigin', value)
                    }
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
                        <Select.Item
                            key={`origin-state-${name}`}
                            value={name}
                            label={name}
                        />
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
                isInvalid={!!touched.lga && !!errors.lga}
            >
                <FormControl.Label>L.G.A of Origin</FormControl.Label>
                <Input
                    size="md"
                    value={values.lga}
                    onBlur={handleBlur('lga')}
                    onChangeText={handleChange('lga')}
                    variant="outline"
                    borderColor="primary.400"
                />
                <FormControl.ErrorMessage>
                    {touched.lga && errors.lga}
                </FormControl.ErrorMessage>
                <FormControl.HelperText></FormControl.HelperText>
            </FormControl>
            <FormControl
                _text={{ fontSize: 'lg' }}
                isRequired
                mb={3}
                isInvalid={
                    !!touched.dateOfBirthTimestamp &&
                    !!errors.dateOfBirthTimestamp
                }
            >
                <FormControl.Label>
                    Date of birth (DD - MM - YYYY)
                </FormControl.Label>
                <HStack alignItems="center" space={2}>
                    {Platform.OS === 'android' ? (
                        showDatePicker ? (
                            <DatePicker
                                value={
                                    values.dateOfBirthTimestamp
                                        ? new Date(values.dateOfBirthTimestamp)
                                        : new Date()
                                }
                                onChange={(event, date) => {
                                    setShowDatePicker(false);
                                    setFieldValue(
                                        'dateOfBirthTimestamp',
                                        event.nativeEvent.timestamp
                                    );
                                }}
                            />
                        ) : (
                            <Input
                                size="md"
                                
                                onPress={() => setShowDatePicker(true)}
                                value={
                                    values.dateOfBirthTimestamp
                                        ? format(
                                              values.dateOfBirthTimestamp,
                                              'dd MMM yyyy'
                                          )
                                        : ''
                                }
                                variant="outline"
                                borderColor="primary.400"
                            />
                        )
                    ) : (
                        <DatePicker
                            value={
                                values.dateOfBirthTimestamp
                                    ? new Date(values.dateOfBirthTimestamp)
                                    : new Date()
                            }
                            onChange={(event, date) =>
                                setFieldValue(
                                    'dateOfBirthTimestamp',
                                    event.nativeEvent.timestamp
                                )
                            }
                        />
                    )}
                </HStack>

                <FormControl.ErrorMessage>
                    {touched.dateOfBirthTimestamp &&
                        errors.dateOfBirthTimestamp}
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
                        accessibilityLabel="display age"
                        value="agreed"
                        isChecked={values.displayAge}
                        onChange={(checked) =>
                            setFieldValue('displayAge', checked)
                        }
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
                mb={3}
                isInvalid={!!touched.tribe && !!errors.tribe}
            >
                <FormControl.Label>Tribe</FormControl.Label>
                <Input
                    size="md"
                    value={values.tribe}
                    onBlur={handleBlur('tribe')}
                    onChangeText={handleChange('tribe')}
                    variant="outline"
                    borderColor="primary.400"
                />
                <FormControl.ErrorMessage>
                    {touched.tribe && errors.tribe}
                </FormControl.ErrorMessage>
                <FormControl.HelperText></FormControl.HelperText>
            </FormControl>
            <HStack space={5}>
                <FormControl
                    _text={{ fontSize: 'lg' }}
                    mb={3}
                    isInvalid={!!touched.shoeSize && !!errors.shoeSize}
                >
                    <FormControl.Label>Shoe Size</FormControl.Label>
                    <Input
                        size="md"
                        type="text"
                        value={values.shoeSize}
                        onBlur={handleBlur('shoeSize')}
                        onChangeText={handleChange('shoeSize')}
                        variant="outline"
                        borderColor="primary.400"
                    />
                    <FormControl.ErrorMessage>
                        {touched.shoeSize && errors.shoeSize}
                    </FormControl.ErrorMessage>
                    <FormControl.HelperText></FormControl.HelperText>
                </FormControl>
                <FormControl
                    _text={{ fontSize: 'lg' }}
                    mb={3}
                    isInvalid={!!touched.height && !!errors.height}
                >
                    <FormControl.Label>Height</FormControl.Label>
                    <Input
                        size="md"
                        type="text"
                        value={values.height}
                        onBlur={handleBlur('height')}
                        onChangeText={handleChange('height')}
                        variant="outline"
                        borderColor="primary.400"
                    />
                    <FormControl.ErrorMessage>
                        {touched.height && errors.height}
                    </FormControl.ErrorMessage>
                    <FormControl.HelperText></FormControl.HelperText>
                </FormControl>
            </HStack>
            <Button
                mt={5}
                variant="outline"
                onPress={() => setFieldValue('step', (values.step || 1) + 1)}
            >
                Next
            </Button>
        </>
    );
};

export default GeneralInfoForm;
