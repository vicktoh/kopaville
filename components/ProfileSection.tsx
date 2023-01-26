import React, { FC } from 'react';
import { Flex, Heading, HStack, Avatar, VStack, Text, IconButton, Icon, Button } from 'native-base';
import { Profile } from '../types/Profile';
import { getInitialsFromName } from '../services/helpers';
import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '../types';

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
    const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

    const gotoFollowing = (tab: "following" | "followers") => {
        navigation.navigate("Following", {
            profile,
            userId,
            tab,
        })
    }
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
            <HStack _text={{ fontSize: 'md' }} space={2} mt={3} alignItems="center">
                <Text fontSize="md" fontWeight="bold">
                    {following}
                </Text>
                <Button onPress={()=> gotoFollowing("following")} fontSize="md" variant="link" colorScheme="primary">Following</Button>
                <Text fontSize="md" fontWeight="bold">
                    {followers}
                </Text>
                <Button onPress={()=> gotoFollowing("followers")} fontSize="md" variant="link" colorScheme="primary">Followers</Button>
            </HStack>
        </Flex>
    );
};
