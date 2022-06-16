import React, { FC} from 'react';
import { Flex, Heading, HStack, Avatar, VStack, Text } from 'native-base';
import { useAppSelector } from '../hooks/redux';
import { Profile } from '../types/Profile';
import { getInitialsFromName } from '../services/helpers';
import { Pressable } from 'react-native';




type ProfileSectionProps = {
    profile: Profile;
    userId: string;
    promptAvatarChange?: ()=> void;
    onOpenPreview : () => void;
}

export const ProfileSection: FC<ProfileSectionProps> = ({profile, userId, promptAvatarChange = ()=> null, onOpenPreview= ()=> null }) =>{
    const { loginInfo, profile:generalProfile, profileUrl, userId: profileId  } = profile || {};
    const { followers = 0, following = 0} = profile?.followerships || {}
    return(
        <Flex direction="column">
            <VStack space={1}>
            <Pressable onPress={ ()=> userId === profileId ? promptAvatarChange(): onOpenPreview()} style={{alignSelf: "flex-start"}}>
            <Avatar source={{uri: profile.profileUrl}}  size="xl" bg="secondary.300" color="primary.500">{getInitialsFromName(loginInfo?.fullname|| "") }</Avatar> 
                </Pressable>
                {
                    userId === profileId ? 
                    (<Text fontSize="xs">Tap Avatar to change</Text>): null
                }
                
                <Heading fontSize="xl" mt={3}>{loginInfo?.fullname}</Heading>
                <Text fontSize="md">{`@${loginInfo?.username}`}</Text>
            </VStack>
            <HStack _text={{fontSize: 'md'}} space={2} mt={3}>
                <Text fontSize="md" fontWeight="bold">{following}</Text>
                <Text fontSize="md">Following</Text>
                <Text fontSize="md" fontWeight="bold">{followers}</Text>
                <Text fontSize="md">Followers</Text>
                {
                    generalProfile?.servingState ? 
                    <Text fontSize="md">{`📍 ${generalProfile.servingState}`} </Text>:
                    null
                }
            </HStack>
        </Flex>
    )
}