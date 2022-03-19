import React, {FC} from 'react';
import {Modal} from 'react-native';
import { Flex, IconButton, ArrowBackIcon, Text, Heading, useDisclose, ScrollView, KeyboardAvoidingView } from 'native-base';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { ProfileSection } from '../components/ProfileSection';
import { DrawerParamList, ProfileStackParamList } from '../types';
import {GeneralProfile} from '../components/GeneralProfile'
import { useAppSelector } from '../hooks/redux';
import { EditProfileForm } from '../components/EditProfileForm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type ProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, "Main">


export const ProfileScreen : FC<ProfileScreenProps> = ({navigation}) =>{
    const { profile } = useAppSelector(({profile}) => ({profile}));
    const  {isOpen, onOpen, onClose, onToggle} = useDisclose();
    return (
        <ScrollView flex = {1} bg = "white">
            <Flex flex= {1} safeArea bg="white">
            <Flex direction="row" alignItems="flex-end"  py={3}>
                <IconButton  size="md" icon = {<ArrowBackIcon />} onPress= {()=> navigation.goBack()} />
                <Heading ml={10}   fontSize="lg">Profile</Heading>                
            </Flex>
            {
                profile ? 
                <GeneralProfile onEdit={()=> navigation.navigate("Edit")} profile={profile} />:
                null
            }
            </Flex>
        </ScrollView>
        
    )
}