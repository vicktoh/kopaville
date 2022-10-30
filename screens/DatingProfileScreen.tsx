import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Flex } from 'native-base';
import React, {FC}  from 'react';
import { DatingProfile } from '../components/DatingProfile';
import { DatingStackParamList } from '../types';


type DatingScreenProps  = NativeStackScreenProps<DatingStackParamList, "Profile">

export const DatingProfileScreen : FC<DatingScreenProps> = ({navigation, route})=>{
    const {profile} = route.params
    return (
        <Flex flex={1} bg="white" pb={3}>
            <DatingProfile profile={profile} />
        </Flex>
    );
}