import React, { FC, useCallback } from 'react';

import {
    Badge,
    Button,
    Flex,
    Heading,
    HStack,
    Icon,
    IconButton,
    Image,
    Text,
} from 'native-base';
import { Chat, ChatType } from '../types/Conversation';
import { format } from 'date-fns/esm';
import { useWindowDimensions } from 'react-native';
import { intervalToDuration } from 'date-fns';
import { chatTime } from '../services/helpers';
import { JobCard } from './JobCard';
import * as WebBrowser from 'expo-web-browser';
import { useNativeBaseConfig } from 'native-base/lib/typescript/core/NativeBaseContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../types';
import { Entypo } from '@expo/vector-icons';

type MessageBubbleProps = {
    authId: string;
    chat: Chat;
};

export const MessageBubble: FC<MessageBubbleProps> = ({
    authId,
    chat: { timestamp, message, toId, fromId, id, type, job, link, post },
}) => {
    const time = chatTime(timestamp);
    const { width: windowWidth } = useWindowDimensions();
    const navigation = useNavigation<NavigationProp<AppStackParamList>>();
    const duration = intervalToDuration({
        start: timestamp.toDate(),
        end: new Date(),
    });
    if (type === ChatType.job && job) {
        return (
            <Flex
                direction="row"
                justifyContent={authId === fromId ? 'flex-start' : 'flex-end'}
                my={2}
            >
                <Flex
                    bg={authId === fromId ? 'primary.200' : 'secondary.200'}
                    maxWidth={windowWidth}
                    px={5}
                    pt={3}
                    pb={3}
                    borderRadius="xl"
                >
                    <HStack space={3} alignItems="center">
                        <Heading fontSize="sm">{message}</Heading>
                        <Badge
                            rounded="lg"
                            bg={job?.title ? 'teal.300' : 'orange.300'}
                        >
                            {job?.title ? 'Job' : 'Service'}
                        </Badge>
                    </HStack>
                    <Text fontSize="xs" my={2}>
                        {job?.location || job?.address}
                    </Text>

                    <HStack space={3}>
                        {link && (
                            <Button
                                onPress={() => {
                                    WebBrowser.openBrowserAsync(link);
                                }}
                                variant="outline"
                                size="xs"
                            >
                                🔗
                            </Button>
                        )}
                        <Button
                            variant="solid"
                            size="xs"
                            onPress={() => {
                                navigation.navigate('Jobs', {
                                    screen: 'Job Details',
                                    params: {
                                        job,
                                    },
                                });
                            }}
                        >
                            View
                        </Button>
                    </HStack>
                </Flex>
            </Flex>
        );
    }
    if (type === ChatType.post && post) {
        return (
            <Flex
                direction="row"
                justifyContent={authId === fromId ? 'flex-start' : 'flex-end'}
                my={2}
            >
                <Flex
                    bg={authId === fromId ? 'primary.200' : 'secondary.200'}
                    maxWidth={windowWidth}
                    px={5}
                    pt={3}
                    pb={3}
                    borderRadius="xl"
                >
                    <HStack space={3} alignItems="center">
                        <Heading fontSize="sm">Shared Post</Heading>
                        <Badge rounded="lg" bg="blue.400">
                            Post
                        </Badge>
                    </HStack>
                    {post.mediaType === 'Image' && post.imageUrl && (
                        <Flex
                            direction="column"
                            width={100}
                            height={(4 / 3) * 100}
                            position="relative"
                            mt={1}
                        >
                            <Image
                                flex={1}
                                alt="Post image"
                                source={{ uri: post.imageUrl[0] }}
                            />
                        </Flex>
                    )}
                    {post.mediaType === 'Video' && (
                        <Icon name="video" as={Entypo} />
                    )}
                    {post.text && <Text>{message}</Text>}
                    <HStack space={3} mt={3}>
                        
                        <Button
                            variant="solid"
                            size="xs"
                            onPress={() => {
                                navigation.navigate('Home', {
                                    screen: 'Explore Post',
                                });
                            }}
                        >
                            View
                        </Button>
                    </HStack>
                </Flex>
            </Flex>
        );
    }
    return (
        <Flex
            direction="row"
            justifyContent={authId === fromId ? 'flex-start' : 'flex-end'}
            my={2}
        >
            <Flex
                bg={authId === fromId ? 'primary.200' : 'secondary.200'}
                maxWidth={windowWidth / 2}
                px={5}
                pt={3}
                pb={3}
                borderRadius="xl"
            >
                <Text fontSize="sm">{message}</Text>
                <Text alignSelf="flex-end" color="primary.500" fontSize={8}>
                    {time}
                </Text>
            </Flex>
        </Flex>
    );
};
