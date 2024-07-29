import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Checkbox, ChevronLeftIcon, Flex, FormControl, Heading, HStack, IconButton, ScrollView, Select, SimpleGrid, Slider, Text } from 'native-base'
import React, { FC, useState } from 'react'
import { DatingStackParamList } from '../types';
import { Gender, GenoType } from '../types/Profile';
const states: string[] = require('../assets/static/states.json');
export type DatingFilter = {
   minAge: number;
   maxAge: number;
   pets: boolean;
   kids: boolean;
   smoking: boolean;
   drinking: boolean;
   servingState: string;
   genotype: string;
   gender?: Gender;
}
export const DEFAULT_DATING_FILTER: DatingFilter = {
   smoking: false,
   drinking: false,
   servingState: '',
   genotype: '',
   pets: false,
   kids: false,
   minAge:  18,
   maxAge: 35,

}
type DatingFilterProps = NativeStackScreenProps<DatingStackParamList, "Search">
export const DatingFilterForm:FC<DatingFilterProps> = ({navigation,route}) => {
   const {  params } = route;
   const {  filter,  } = params
   const [formState, setFormState] = useState<DatingFilter>(filter || DEFAULT_DATING_FILTER);
   const onUpdate = (key: keyof DatingFilter, value: DatingFilter[keyof DatingFilter]) => {
      setFormState((state)=> ({...(state || {}), [key]: value}))
   }
   const onSubmitFilter = ()=> {
    
    navigation.navigate('Main', {filter: formState});
   }
  return (
      <ScrollView bg="white" flex={1} px={5}>
          <IconButton
              icon={<ChevronLeftIcon />}
              accessibilityLabel="goback"
              onPress={() => navigation.goBack()}
              alignSelf="flex-start"
              mb={5}
          />
          <Flex flex={1} >
              <Heading fontSize="lg">Dating Filter</Heading>
              <Text mt={1} mb={5}>
                  Filter dating profiles to your preference
              </Text>
              <Heading fontSize="md" mb={2}>
                  Filter
              </Heading>
              <FormControl mb={4}>
                  <FormControl.Label>Serving State</FormControl.Label>
                  <Select
                      width="100%"
                      selectedValue={formState.servingState}
                      onValueChange={(value) => onUpdate('servingState', value)}
                      variant="outline"
                      borderColor="primary.400"
                  >
                      <Select.Item key={'all'} value="" label="Any" />
                      {states.map((value) => (
                          <Select.Item
                              key={`serving-state-${value}`}
                              value={value}
                              label={value}
                          />
                      ))}
                  </Select>
              </FormControl>
              <FormControl mb={4}>
                  <FormControl.Label>Gender</FormControl.Label>
                  <Select
                      width="100%"
                      selectedValue={formState.gender}
                      onValueChange={(value) => onUpdate('gender', value)}
                      variant="outline"
                      borderColor="primary.400"
                  >
                      <Select.Item value="" label="Any" />
                      {Object.keys(Gender).map((gender, i) => (
                          <Select.Item
                              key={`direction-${i}`}
                              value={gender}
                              label={gender}
                          />
                      ))}
                  </Select>
              </FormControl>
              <FormControl mb={4}>
                  <Flex direction="row" justifyContent="space-between">
                      <HStack space={2} alignItems="center">
                          <Checkbox
                              value="kids"
                              isChecked={formState.kids}
                              accessibilityLabel="kids check"
                              onChange={(isSelected) => {
                                  onUpdate('kids', isSelected);
                              }}
                          />
                          <Text fontSize="sm">👶🏽 Has Kids</Text>
                      </HStack>
                      <HStack space={2} alignItems="center">
                          <Checkbox
                              accessibilityLabel="pets check"
                              value="true"
                              isChecked={formState.pets}
                              onChange={(isSelected) => {
                                  onUpdate('pets', isSelected);
                              }}
                          />
                          <Text fontSize="sm">🐶 Has Pets</Text>
                      </HStack>
                  </Flex>
              </FormControl>
              <FormControl mb={4}>
                  <Flex direction="row" justifyContent="space-between">
                      <HStack space={2} alignItems="center">
                          <Checkbox
                              value="true"
                              isChecked={formState.smoking}
                              accessibilityLabel="check smoking"
                              onChange={(isSelected) => {
                                  onUpdate('smoking', isSelected);
                              }}
                          />
                          <Text fontSize="sm">🚬Smokes</Text>
                      </HStack>
                      <HStack space={2} alignItems="center">
                          <Checkbox
                              isChecked={formState.drinking}
                              value="true"
                              onChange={(isSelected) => {
                                  onUpdate('drinking', isSelected);
                              }}
                              accessibilityLabel="check drinks"
                          />
                          <Text fontSize="sm">🥃 Drinks</Text>
                      </HStack>
                  </Flex>
              </FormControl>
              <FormControl mb={4}>
                  <FormControl.Label>Minimum age</FormControl.Label>
                  <Text fontSize="md">{formState.minAge}</Text>
                  <Slider
                      defaultValue={formState.minAge || 18}
                      onChange={(value) => onUpdate('minAge', value)}
                      onChangeEnd={(value) => onUpdate('minAge', value)}
                      minValue={18}
                      maxValue={35}
                  >
                      <Slider.Track shadow={2}>
                          <Slider.FilledTrack />
                      </Slider.Track>
                      <Slider.Thumb shadow={3} />
                  </Slider>
              </FormControl>
              <FormControl mb={4}>
                  <FormControl.Label>Maximum age</FormControl.Label>
                  <Text fontSize="md">{formState.maxAge}</Text>
                  <Slider
                      step={1}
                      defaultValue={formState.maxAge}
                      minValue={18}
                      maxValue={35}
                      onChange={(value) => onUpdate('maxAge', value)}
                      onChangeEnd={(value) => onUpdate('maxAge', value)}
                      value={formState.maxAge}
                  >
                      <Slider.Track shadow={2}>
                          <Slider.FilledTrack />
                      </Slider.Track>
                      <Slider.Thumb shadow={3} />
                  </Slider>
              </FormControl>
              <FormControl mb={3}>
                  <FormControl.Label>Genotype</FormControl.Label>
                  <Select
                      variant="outline"
                      borderColor="primary.400"
                      selectedValue={formState.genotype}
                      onValueChange={(text) => {
                          onUpdate('genotype', text);
                      }}
                  >
                      <Select.Item value="" label="Any" />
                      {Object.keys(GenoType).map((group) => (
                          <Select.Item
                              key={`group-${group}`}
                              value={group}
                              label={group}
                          />
                      ))}
                  </Select>
                  <Button
                    variant="outline"
                    width="100%"
                    my={3}
                    onPress={()=> navigation.goBack()}
                  >Cancel</Button>
                  <Button
                      onPress={onSubmitFilter}
                      width="100%"
                      variant="solid"
                      my={3}
                      colorScheme="primary"
                  >
                      Apply Filter
                  </Button>
              </FormControl>
          </Flex>
      </ScrollView>
  );
}
