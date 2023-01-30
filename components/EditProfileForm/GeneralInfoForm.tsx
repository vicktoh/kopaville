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
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { EditFormValuesType } from '.';
const states: string[] = require('../../assets/static/states.json');

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
                isInvalid={!!touched.dateOfBirth && !!errors.dateOfBirth}
            >
                <FormControl.Label>
                    Date of birth (DD - MM - YYYY)
                </FormControl.Label>
                <HStack alignItems="center" space={2}>
                    <Input
                        size="lg"
                        value={values.dateOfBirth.day}
                        onBlur={handleBlur('dateOfBirth.day')}
                        onChangeText={handleChange('dateOfBirth.day')}
                        variant="outline"
                        borderColor="primary.400"
                        maxWidth={(WINDO_WIDTH - 80)/3}
                        placeholder="DD"
                    />
                    <Input
                        size="lg"
                        value={values.dateOfBirth.month}
                        onBlur={handleBlur('dateOfBirth.month')}
                        onChangeText={handleChange('dateOfBirth.month')}
                        variant="outline"
                        maxWidth={(WINDO_WIDTH -80)/3}
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
                        maxWidth={(WINDO_WIDTH - 4)/3}
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
