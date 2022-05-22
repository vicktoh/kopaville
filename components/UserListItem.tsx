import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Avatar, Button, Flex, Heading, HStack, Pressable, Text, useToast, VStack } from 'native-base';
import React, { FC, useMemo, useState } from 'react';
import { useAppSelector } from '../hooks/redux';
import { Follower, followUser } from '../services/followershipServices';
import { HomeStackParamList } from '../types';
import { Profile } from '../types/Profile';

const defaultAvartar = require('../assets/images/avatar.png');

type UserListItemProps = {
    profile: Profile;
};

export const UserListItem: FC<UserListItemProps> = ({ profile }) => {
    const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
    const { followerships, auth } = useAppSelector(({ followerships, auth }) => ({ followerships, auth }));
    const following = useMemo(
        () => (followerships?.following || []).filter(({ userId }) => userId == profile.userId),
        []
    );
    const [isfollowing, setIsfollowing] = useState<boolean>(!!following.length);
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useToast();

    const follow = async () => {
        try {
            setLoading(true);
            const { userId, profileUrl = "", loginInfo: { username, fullname}} = profile;
            const follower: Follower = { userId, username, fullname, photoUrl: profileUrl};
            await followUser(auth?.userId || '', follower);
        } catch (error) {
            console.log(error);
            let err: any = error;
            toast.show({
                placement: 'top',
                title: 'error',
                description: err?.message || 'Could not follow user, Try again',
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <Flex
            direction="row"
            justifyContent="space-between"
            width="100%"
            py={3}
            borderBottomWidth={1}
            borderBottomColor="secondary.300"
            alignItems="center"
            px={3}
        >
            <HStack space={2} alignItems="center">
                <Pressable onPress={()=> navigation.navigate("ProfilePreview", { userId: profile.userId})}>
                <Avatar source={profile?.profileUrl ? { uri: profile.profileUrl } : defaultAvartar} size="md">
                    {' '}
                    AV
                </Avatar> 
                </Pressable>
                
                <VStack>
                    <Heading fontSize="md">{profile?.loginInfo?.fullname || 'Unknown User'}</Heading>
                    <Text fontSize="sm">{profile?.loginInfo?.username}</Text>
                </VStack>
            </HStack>
            {isfollowing ? (
                <Button size="sm" variant="outline">
                    Unfollow
                </Button>
            ) : (
                <Button isLoading={loading} size="sm" variant="solid" onPress={()=> follow()}>
                    Follow
                </Button>
            )}
        </Flex>
    );
};
