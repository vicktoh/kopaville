import React, { FC } from 'react';
import { Platform } from 'react-native';
import { ScrollView, Flex, KeyboardAvoidingView } from 'native-base';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList, ProfileStackParamList } from '../types';
import { useAppSelector } from '../hooks/redux';
import { DatingProfile } from '../components/DatingProfile';

type DatingScreenProps = DrawerScreenProps<DrawerParamList, 'Career Profile'>;

export const DatingScreen: FC<DatingScreenProps> = ({ navigation, route }) => {
    const { profile, auth } = useAppSelector(({ profile, auth }) => ({
        profile,
        auth,
    }));

    const profileToshow = route.params?.profile || profile;
    return (
        <Flex flex={1} bg="white" safeArea>
                {profileToshow && <DatingProfile profile={profileToshow} />}
        </Flex>
    );
};
