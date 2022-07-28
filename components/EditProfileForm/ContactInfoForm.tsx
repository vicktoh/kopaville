import { AntDesign } from '@expo/vector-icons';
import { useFormikContext } from 'formik';
import {
   Badge,
    Button,
    Checkbox,
    ChevronDownIcon,
    ChevronLeftIcon,
    Flex,
    FormControl,
    Heading,
    HStack,
    Icon,
    IconButton,
    Input,
    Select,
    Text,
} from 'native-base';
import React from 'react';
import { EditFormValuesType } from '.';

export const ContactInfoForm = () => {
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

    const removeLanguage = (i:number)=>{
      if(!values.languages?.length) return;
      let langs = [...values.languages];
      langs.splice(i, 1);
      setFieldValue("languages", langs);
    }
    const addLanguage = () => {
      const language = values.languageInput
      if(!language) return;
      setFieldValue('languages', [...(values.languages || []), language]);
      setFieldValue('languageInput', '');
    }
    return (
        <>
            <FormControl
                _text={{ fontSize: 'lg' }}
                mb={3}
                isInvalid={!!touched.phoneNumber && !!errors.phoneNumber}
            >
                <FormControl.Label>Phone Number</FormControl.Label>
                <Input
                    size="md"
                    value={values.phoneNumber}
                    onBlur={handleBlur('phoneNumber')}
                    onChangeText={handleChange('phoneNumber')}
                    variant="outline"
                    borderColor="primary.400"
                />
                <FormControl.ErrorMessage>
                    {touched.phoneNumber && errors.phoneNumber}
                </FormControl.ErrorMessage>
                <FormControl.HelperText></FormControl.HelperText>
            </FormControl>
            <FormControl
                _text={{ fontSize: 'lg' }}
                isRequired
                mb={3}
                isInvalid={!!touched.displayPhoneNumber && !!errors.displayPhoneNumber}
            >
                <HStack space={3}>
                    <Checkbox
                        accessibilityLabel="agree to terms"
                        value="agreed"
                        isChecked={values.displayPhoneNumber}
                        onChange={(checked) =>
                            setFieldValue('displayPhoneNumber', checked)
                        }
                    />
                    <FormControl.Label>display phone number publicly ?</FormControl.Label>
                </HStack>
                <FormControl.ErrorMessage>
                    {touched.displayPhoneNumber && errors.displayPhoneNumber}
                </FormControl.ErrorMessage>
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
                <FormControl.ErrorMessage>
                    {touched.twitter && errors.twitter}
                </FormControl.ErrorMessage>
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
                <FormControl.ErrorMessage>
                    {touched.instagram && errors.instagram}
                </FormControl.ErrorMessage>
                <FormControl.HelperText></FormControl.HelperText>
            </FormControl>
            <FormControl>
               <FormControl.Label>Languages Spoken</FormControl.Label>
            <Flex direction="row" >
               <Input
                    placeholder='Enter a new language'
                    size="md"
                    flex={5}
                    value={values.languageInput}
                    onBlur={handleBlur('languageInput')}
                    onChangeText={handleChange('languageInput')}
                    variant="outline"
                    borderColor="primary.400"
                    />
                <Button onPress={addLanguage} ml={2} flex={2} variant="solid" size="sm">
                  Add
                </Button>
            </Flex>
            </FormControl>
            <HStack flexWrap="wrap" space={3} my={2}>
               {
                  values.languages?.length ? 
                  values.languages.map((lan, i)=>(
                     <HStack space={3}  alignItems="center" mt={3} key = {'language-${i}'} px={5} py={2} bg="secondary.200">
                        <Text color="primary.500">{lan}</Text>
                        <IconButton icon= {<Icon size={5} as = {AntDesign} name = "closecircleo" />} onPress={() => removeLanguage(i)} size="sm" />
                     </HStack>
                  )):
                  null
               }
            </HStack>
            <Flex justifyContent="space-between" px={3} direction="row">
                <Button
                    variant="outline"
                    onPress={() =>
                        setFieldValue('step', (values.step || 1) - 1)
                    }
                >
                    Previous
                </Button>
            </Flex>
        </>
    );
};
