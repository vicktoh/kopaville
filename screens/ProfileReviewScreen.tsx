import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Flex, ScrollView, Text, useToast } from 'native-base';
import React, { FC, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { EmptyState } from '../components/EmptyeState';
import { GeneralProfile } from '../components/GeneralProfile';
import { fetchUserProfile, listenOnProfile } from '../services/profileServices';
import { HomeStackParamList } from '../types';
import { Profile } from '../types/Profile';

type ProfileReviewScreenProps = NativeStackScreenProps<
    HomeStackParamList,
    'ProfilePreview'
>;

export const ProfileReviewScreen: FC<ProfileReviewScreenProps> = ({
    navigation,
    route,
}) => {
    const { profile, fetch, userId } = route.params;
    const [loading, setLoading] = useState<boolean>(false);
    const [userProfile, setProfile] = useState<Profile | null>(profile || null);
    const toast = useToast();
    useEffect(() => {
        const fetchUser = () => {
            if (userId && !userProfile) {
                try {
                    setLoading(true);
                    return listenOnProfile(userId, (data) => {
                        if (data) setProfile(data as Profile);
                        setLoading(false);
                    });
                } catch (error) {
                    let err: any = error;
                    toast.show({
                        title: 'Error Occured',
                        status: 'error',
                        placement: 'top',
                        description: err?.message || 'Error occured try again',
                    });
                } finally {
                }
            }
        };
        const unsubscribe = fetchUser();
        return () => unsubscribe && unsubscribe();
    }, [profile, userId]);

    if (loading) {
        return (
            <Flex flex={1} justifyContent="center" alignItems="center">
                <ActivityIndicator size={24} />
                <Text>Fetcing user...</Text>
            </Flex>
        );
    }
    if (userProfile) {
        return (
            <ScrollView flex={1} bg="white">
                <GeneralProfile profile={userProfile} />
            </ScrollView>
        );
    }

    return <EmptyState />;
};
