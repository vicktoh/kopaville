import React, {FC} from 'react';
import {Modal, Platform} from 'react-native';
import { Flex, IconButton, ArrowBackIcon, Text, Heading, useDisclose, ScrollView, KeyboardAvoidingView, HStack } from 'native-base';
import { ProfileSection } from '../components/ProfileSection';
import { DrawerParamList, ProfileStackParamList } from '../types';
import {GeneralProfile} from '../components/GeneralProfile'
import { useAppSelector } from '../hooks/redux';
import { EditProfileForm } from '../components/EditProfileForm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type EditProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, "Edit">


export const EditProfileScreen : FC<EditProfileScreenProps> = ({navigation}) =>{
    const { profile } = useAppSelector(({profile}) => ({profile}));
    return (
        <KeyboardAvoidingView bg="white"  behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView bg="white">
                <Flex flex = {1} direction="column" bg="white" py={5} px={5} borderRadius="2xl" safeArea>
                    <IconButton onPress={()=> navigation.goBack() } icon= {<ArrowBackIcon/>} mb={3}/>
                    
                    <Heading>Edit Profile</Heading>
                    
                    <EditProfileForm onCancel={()=> navigation.goBack()} />
                </Flex>
                </ScrollView>
        </KeyboardAvoidingView>
    )
}