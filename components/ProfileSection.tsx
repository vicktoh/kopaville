import React, { FC } from 'react';
import { Flex, Heading, HStack, Avatar, VStack, Text, IconButton, Icon } from 'native-base';
import { Profile } from '../types/Profile';
import { getInitialsFromName } from '../services/helpers';
import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type ProfileSectionProps = {
    profile: Profile;
    userId: string;
    promptAvatarChange?: () => void;
    onOpenPreview: () => void;
};

export const ProfileSection: FC<ProfileSectionProps> = ({
    profile,
    userId,
    promptAvatarChange = () => null,
    onOpenPreview = () => null,
}) => {
    const {
        loginInfo,
        profile: generalProfile,
        profileUrl,
        userId: profileId,
        verified
    } = profile || {};
    const { followers = 0, following = 0 } = profile?.followerships || {};
    return (
        <Flex direction="column">
            <VStack space={1}>
                <Pressable
                    onPress={() =>
                        userId === profileId
                            ? promptAvatarChange()
                            : onOpenPreview()
                    }
                    style={{ alignSelf: 'flex-start' }}
                >
                    <Avatar
                        source={{ uri: profile.profileUrl }}
                        size="xl"
                        bg="secondary.300"
                        color="primary.500"
                    >
                        {getInitialsFromName(loginInfo?.fullname || '')}
                    </Avatar>
                </Pressable>
                {userId === profileId ? (
                    <Text fontSize="xs">Tap Avatar to change</Text>
                ) : null}
                <HStack space={3}>
                    <Heading fontSize="xl" mt={3}>
                        {loginInfo?.fullname}
                    </Heading>
                    {verified ? (
                        <Icon as={MaterialIcons} name="verified" size={5} />
                    ) : null}
                </HStack>
                <Flex direction="row" justifyContent="space-between">
                    <Text fontSize="md">{`@${loginInfo?.username}`}</Text>
                    {generalProfile?.servingState ? (
                        <Text fontSize="md">
                            {`📍 ${generalProfile.servingState}`}{' '}
                        </Text>
                    ) : null}
                </Flex>
            </VStack>
            <HStack _text={{ fontSize: 'md' }} space={2} mt={3}>
                <Text fontSize="md" fontWeight="bold">
                    {following}
                </Text>
                <Text fontSize="md">Following</Text>
                <Text fontSize="md" fontWeight="bold">
                    {followers}
                </Text>
                <Text fontSize="md">Followers</Text>
            </HStack>
        </Flex>
    );
};
