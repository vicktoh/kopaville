import React, {FC} from 'react';
import { Flex, IconButton, ArrowBackIcon, Heading, ScrollView } from 'native-base';
import { ProfileStackParamList } from '../types';
import {GeneralProfile} from '../components/GeneralProfile'
import { useAppSelector } from '../hooks/redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type ProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, "Main">


export const ProfileScreen : FC<ProfileScreenProps> = ({navigation}) =>{
    const { profile } = useAppSelector(({profile}) => ({profile}));
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