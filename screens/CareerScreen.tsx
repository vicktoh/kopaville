import React, { FC } from 'react';
import { Platform } from 'react-native';
import {
    ScrollView,
    KeyboardAvoidingView,
} from 'native-base';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../types';
import { useAppSelector } from '../hooks/redux';

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
         <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
         {profileToshow && <CareerProfile  profile={profileToshow} />}
         </KeyboardAvoidingView>
        </ScrollView>
    );
};
