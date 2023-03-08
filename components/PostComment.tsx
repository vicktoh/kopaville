import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Avatar, Flex, HStack, Text, VStack } from 'native-base';
import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
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
        <Flex py={3} flexDirection="row" flexShrink={1}>
            <Flex
                
                flexDirection="row"
                flexShrink={1}
            >
                <HStack
                    space={2}
                    alignItems="flex-start"
                    flexDirection="row"
                    py={1}
                    flexShrink={1}
                >
                    <TouchableOpacity
                    onPress={() =>{
                        navigation.goBack();

                    auth?.userId === userId
                        ? navigation.navigate('General Profile', {})
                        : navigation.navigate('ProfilePreview', {
                              userId: userId,
                          })}
                }
                    >
                        <Avatar
                            size="sm"
                            source={{ uri: photoUrl || DEFAULT_AVATAR_IMAGE }}
                        >
                            {username.slice(0, 2)}
                        </Avatar>
                    </TouchableOpacity>
                    <VStack flexShrink={1}>
                        <Text fontSize="sm" fontWeight="bold">
                            {username}
                        </Text>
                        <Flex
                            flexDirection="row"
                            flexGrow={1}
                        >
                            <Text fontSize="md" my={1} flexShrink={1}>
                                {commentText}
                            </Text>
                        </Flex>
                    </VStack>
                </HStack>
            </Flex>
        </Flex>
    );
};
