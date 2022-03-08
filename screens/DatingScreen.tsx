import React, { FC } from 'react';
import { Modal, Platform } from 'react-native';
import {
    ScrollView,
    KeyboardAvoidingView,
} from 'native-base';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList, ProfileStackParamList } from '../types';
import { useAppSelector } from '../hooks/redux';
import { CareerProfile } from '../components/CareerProfile';
import { DatingProfile } from '../components/DatingProfile';

type DatingScreenProps = DrawerScreenProps<DrawerParamList, 'Career Profile'>;

export const DatingScreen: FC<DatingScreenProps> = ({ navigation, route }) => {
    const { profile, auth } = useAppSelector(({ profile, auth }) => ({
        profile,
        auth,
    }));
    
    const profileToshow  =  route.params?.profile || profile
    return (
        
        <ScrollView flex={1} bg="white">
         <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
         {profileToshow && <DatingProfile  profile={profileToshow} />}
         </KeyboardAvoidingView>
        </ScrollView>
    );
};
