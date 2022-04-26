import React, { FC } from 'react';
import {
    ArrowBackIcon,
    Flex,
    Heading,
    IconButton,
    KeyboardAvoidingView,
    ScrollView,
} from 'native-base';
import { DatingProfile } from '../components/DatingProfile';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserDatingStackParamList } from '../types';
import { Platform } from 'react-native';
import { DatingProfileForm } from '../components/DatingProfileForm';

type EditDatingProfileScreenProps = NativeStackScreenProps<
    UserDatingStackParamList,
    'Edit Dating Profile'
>;

export const EditDatingProfileScreen: FC<EditDatingProfileScreenProps> = ({
    navigation,
    route,
}) => {
    const { profile } = route?.params;
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView bg="white">
                <Flex
                    flex={1}
                    bg="white"
                    px={5}
                    pb={10}
                    borderRadius="2xl"
                    safeArea
                >
                    <IconButton
                        my={5}
                        onPress={() => navigation.goBack()}
                        icon={<ArrowBackIcon />}
                    />
                    <Heading>Dating Profile</Heading>
                    <DatingProfileForm
                        profile={profile?.datingProfile}
                        onClose={() => navigation.goBack()}
                    />
                </Flex>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
