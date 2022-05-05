import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Avatar, Flex, HStack, Pressable, Text, VStack } from 'native-base';
import React, { FC } from 'react';
import { DEFAULT_AVATAR_IMAGE } from '../constants/files';
import { useAppSelector } from '../hooks/redux';
import { DrawerParamList, HomeStackParamList } from '../types';
import { Comment } from '../types/Comment';

type PostcommentProps = {
    comment: Comment;
};
export const PostComment: FC<PostcommentProps> = ({ comment }) => {
    const { auth } = useAppSelector(({ auth }) => ({ auth }));
    const { userId, username, photoUrl, comment: commentText } = comment;
    const navigation =
        useNavigation<NavigationProp<HomeStackParamList & DrawerParamList>>();
    return (
        <Flex py={3}>
            <Pressable
                onPress={() =>
                    auth?.userId === userId
                        ? navigation.navigate('Profile', {})
                        : navigation.navigate('ProfilePreview', {
                              userId: userId,
                          })
                }
            >
                <HStack space={2} alignItems="center" py={1}>
                    <Avatar
                        size="md"
                        source={{ uri: photoUrl || DEFAULT_AVATAR_IMAGE }}
                    >
                        {username.slice(0, 2)}
                    </Avatar>
                    <VStack>
                        <Text fontSize="sm" fontWeight="bold">
                            {username}
                        </Text>
                        <Text fontSize="md" my={1}>
                            {commentText}
                        </Text>
                    </VStack>
                </HStack>
            </Pressable>
        </Flex>
    );
};
