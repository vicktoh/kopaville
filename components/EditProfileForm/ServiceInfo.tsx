import { useFormikContext } from 'formik';
import { Button, ChevronDownIcon, Flex, FormControl, Input, Select } from 'native-base';
import React from 'react';
import { EditFormValuesType } from '.';
import { CorperStatus } from '../../types/Profile';
const states: string[] = require('../../assets/static/states.json');

const ServiceInfo = () => {
    const { values, touched, errors, isValid, handleBlur, handleChange, setFieldValue } =
        useFormikContext<EditFormValuesType>();
    return (
        <>
            <FormControl
                _text={{ fontSize: 'lg' }}
                isRequired
                mb={3}
                isInvalid={!!touched.servingState && !!errors.servingState}
                bg="white"
            >
                <FormControl.Label>Serving State</FormControl.Label>
                <Select
                    onValueChange={(value) =>
                        setFieldValue('servingState', value)
                    }
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
                        <Select.Item
                            key={`serving-state-${i}`}
                            value={name}
                            label={name}
                        />
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
                isInvalid={!!touched.corperStatus && !!errors.corperStatus}
                bg="white"
            >
                <FormControl.Label>Serving Status</FormControl.Label>
                <Select
                    onValueChange={(value) =>
                        setFieldValue('corperStatus', value)
                    }
                    _actionSheetContent={{ bg: 'white' }}
                    _selectedItem={{ bg: 'primary.100', color: 'gray.700' }}
                    dropdownIcon={<ChevronDownIcon color="black" />}
                    accessibilityLabel="Choose account type"
                    size="lg"
                    selectedValue={values.corperStatus}
                    variant="outline"
                    borderColor="primary.400"
                >
                    {Object.keys(CorperStatus).map((name, i) => (
                        <Select.Item
                            key={`corper-status-${i}`}
                            value={name}
                            label={name}
                        />
                    ))}
                </Select>
                <FormControl.ErrorMessage>
                    {touched.corperStatus && errors.corperStatus}
                </FormControl.ErrorMessage>
                <FormControl.HelperText></FormControl.HelperText>
            </FormControl>
            <FormControl
                _text={{ fontSize: 'lg' }}
                mb={3}
                isInvalid={!!touched.servingLGA && !!errors.servingLGA}
            >
                <FormControl.Label>Serving L.G.A</FormControl.Label>
                <Input
                    size="md"
                    value={values.servingLGA}
                    onBlur={handleBlur('servingLGA')}
                    onChangeText={handleChange('servingLGA')}
                    variant="outline"
                    borderColor="primary.400"
                />
                <FormControl.ErrorMessage>
                    {touched.servingLGA && errors.servingLGA}
                </FormControl.ErrorMessage>
                <FormControl.HelperText></FormControl.HelperText>
            </FormControl>
            <FormControl
                _text={{ fontSize: 'lg' }}
                mb={3}
                isInvalid={!!touched.camp && !!errors.camp}
            >
                <FormControl.Label>
                    Camp Location
                </FormControl.Label>
                <Input
                    size="md"
                    value={values.camp}
                    onBlur={handleBlur('camp')}
                    onChangeText={handleChange('camp')}
                    variant="outline"
                    borderColor="primary.400"
                />
                <FormControl.ErrorMessage>
                    {touched.camp && errors.camp}
                </FormControl.ErrorMessage>
                <FormControl.HelperText></FormControl.HelperText>
            </FormControl>
            <FormControl
                _text={{ fontSize: 'lg' }}
                mb={3}
                isInvalid={!!touched.camp && !!errors.camp}
            >
                <FormControl.Label>
                    SAED Course
                </FormControl.Label>
                <Input
                    size="md"
                    value={values.saedCourse}
                    onBlur={handleBlur('saedCourse')}
                    onChangeText={handleChange('saedCourse')}
                    variant="outline"
                    borderColor="primary.400"
                />
                <FormControl.ErrorMessage>
                    {touched.saedCourse && errors.saedCourse}
                </FormControl.ErrorMessage>
                <FormControl.HelperText></FormControl.HelperText>
            </FormControl>
            <FormControl
                _text={{ fontSize: 'lg' }}
                mb={3}
                isInvalid={!!touched.platoon && !!errors.platoon}
            >
                <FormControl.Label>
                    Platoon
                </FormControl.Label>
                <Input
                    size="md"
                    value={values.platoon}
                    onBlur={handleBlur('platoon')}
                    onChangeText={handleChange('platoon')}
                    variant="outline"
                    borderColor="primary.400"
                />
                <FormControl.ErrorMessage>
                    {touched.platoon && errors.platoon}
                </FormControl.ErrorMessage>
                <FormControl.HelperText></FormControl.HelperText>
            </FormControl>
            <FormControl
                _text={{ fontSize: 'lg' }}
                mb={3}
                isInvalid={!!touched.ppa && !!errors.ppa}
            >
                <FormControl.Label>
                    Place of Primary Assignment (P.P.A)
                </FormControl.Label>
                <Input
                    size="md"
                    value={values.ppa}
                    onBlur={handleBlur('ppa')}
                    onChangeText={handleChange('ppa')}
                    variant="outline"
                    borderColor="primary.400"
                />
                <FormControl.ErrorMessage>
                    {touched.ppa && errors.ppa}
                </FormControl.ErrorMessage>
                <FormControl.HelperText></FormControl.HelperText>
            </FormControl>
            
            <Flex justifyContent="space-between" px={3} direction="row">
            <Button
                variant="outline"
                onPress={() => setFieldValue('step', (values.step || 1) - 1)}
                >
                Previous
            </Button>
            <Button
               
                variant="solid"
                onPress={() => setFieldValue('step', (values.step || 0) + 1)}
                >
                Next
            </Button>

            </Flex>
        </>
    );
};

export default ServiceInfo;
