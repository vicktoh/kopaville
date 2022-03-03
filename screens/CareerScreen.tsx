import React, { FC } from 'react';
import { Modal } from 'react-native';
import {
    Flex,
    IconButton,
    ArrowBackIcon,
    Text,
    Heading,
    useDisclose,
    ScrollView,
    KeyboardAvoidingView,
    HStack,
    Avatar,
    VStack,
} from 'native-base';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { ProfileSection } from '../components/ProfileSection';
import { DrawerParamList, ProfileStackParamList } from '../types';
import { GeneralProfile } from '../components/GeneralProfile';
import { useAppSelector } from '../hooks/redux';
import { EditProfileForm } from '../components/EditProfileForm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getInitialsFromName } from '../services/helpers';
import { CareerProfile } from '../components/CareerProfile';

type CareerScreenProps = DrawerScreenProps<DrawerParamList, 'Career Profile'>;

export const CareerScreen: FC<CareerScreenProps> = ({ navigation, route }) => {
    const { profile, auth } = useAppSelector(({ profile, auth }) => ({
        profile,
        auth,
    }));
    
    const profileToshow  =  route.params?.profile || profile
    return (
        
        <ScrollView flex={1} bg="white" px={5}>
         <KeyboardAvoidingView>
         {profileToshow && <CareerProfile  profile={profileToshow} />}
         </KeyboardAvoidingView>
        </ScrollView>
    );
};
