import React, { FC, useMemo, useRef, useState } from 'react';
import {
    Avatar,
    Flex,
    HStack,
    Icon,
    IconButton,
    Menu,
    Text,
    useToast,
} from 'native-base';
import { Post } from '../types/Post';
import { Pressable, useWindowDimensions } from 'react-native';
import { DEFAULT_AVATAR_IMAGE } from '../constants/files';
import { ImageScroller } from './ImageScroller';
import { AVPlaybackStatus, ResizeMode, Video, VideoProps } from 'expo-av';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { DrawerParamList, HomeStackParamList } from '../types';
import { useAppSelector } from '../hooks/redux';
import { useDispatch } from 'react-redux';
import {
    addPostTolikes,
    removePost,
    removePostFromLikes,
} from '../services/postsServices';
import { addLike, removeLike } from '../reducers/likesSlice';
import InviewPort from './InView';
import { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
type PostProps = {
    post: Post;
};

export const UserPost: FC<PostProps> = ({ post }) => {
    const { auth, likes: likedPosts } = useAppSelector(({ auth, likes }) => ({
        auth,
        likes,
    }));
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const avatarUrl = post?.avartar?.photoUrl || DEFAULT_AVATAR_IMAGE;
    const username = post?.avartar?.username || 'Unknown Username';
    const isPostLiked = useMemo(
        () => likedPosts.includes(post?.postId || ''),
        [likedPosts]
    );
    const [isLiking, setIsLiking] = useState<boolean>();
    const [isRemoving, setRemoving] = useState<boolean>();
    const dispatch = useDispatch();
    const toast = useToast();
    const {
        mediaType = 'None',
        imageUrl = [],
        videoUrl,
        text = '',
        comments,
        likes,
        postId = '',
        creatorId,
    } = post;

    const [videoPlaybackStatus, setPlayBackStatus] =
        useState<AVPlaybackStatus>();
    const navigation =
        useNavigation<NavigationProp<HomeStackParamList & DrawerParamList>>();
    const videoRef = useRef<Video>(null);

    const likePost = async () => {
        try {
            setIsLiking(true);
            await addPostTolikes(auth?.userId || '', postId || '');
        } catch (error) {
            console.log(error);
            let err: any = error;
            toast.show({
                title: 'Could not Like Post',
                description:
                    'Something went wrong. Please ensure you have good internet connection',
                variant: 'subtle'
            });
        } finally {
            setIsLiking(false);
        }
    };

    const unlikePost = async () => {
        try {
            const index = likedPosts.findIndex(
                (post, index) => postId === post
            );
            setIsLiking(true);
            await removePostFromLikes(auth?.userId || '', postId || '');
            if (index > -1) {
                dispatch(removeLike(index));
            }
        } catch (error) {
            console.log(error);
            let err: any = error;
            toast.show({
                title: 'Couldnot un-like post',
                variant: 'subtle',
                description:
                    'Something went wrong. Please ensure you have good internet connection',
            });
        } finally {
            setIsLiking(false);
        }
    };
    const deletePost = () => {
        try {
            setRemoving(true)
            removePost(postId);


        } catch (error) {
            setRemoving(false);
            const err: any = error;
            toast.show({
                title: 'Could not remove post',
                description: err?.message || 'Unexpected Error Try again',
                variant: 'subtle',
            });
        }
    };
    const isInView = async (isVisible: boolean) => {
        if (!isVisible) {
            if (
                videoPlaybackStatus?.isLoaded &&
                videoPlaybackStatus.isPlaying
            ) {
                // console.log("out of view", postId)
                await videoRef.current?.stopAsync();
                return;
            }
        }
        // else{
        //     if(videoPlaybackStatus?.isLoaded && !videoPlaybackStatus.isPlaying){
        //         await videoRef.current?.playAsync()
        //     }
        // }
    };
    return (
        <Flex width={windowWidth} px={2} mb={5}>
            <Flex
                direction="row"
                alignItems="center"
                justifyContent="space-between"
            >
                <Pressable
                    onPress={() =>
                        auth?.userId === post.creatorId
                            ? navigation.navigate('General Profile', {})
                            : navigation.navigate('ProfilePreview', {
                                  userId: post.creatorId,
                              })
                    }
                >
                    <HStack space={2} alignItems="center" py={1}>
                        <Avatar size="md" source={{ uri: avatarUrl }}>
                            {username.slice(0, 2)}
                        </Avatar>
                        <Text fontSize="sm" fontWeight="bold">
                            {username}
                        </Text>
                    </HStack>
                </Pressable>
                {
                    post?.dateCreated ? 
                    <Text fontSize="xs" color="primary.400">{formatDistanceToNow(post.dateCreated as number)}</Text> : null
                }
            </Flex>

            {imageUrl.length ? (
                <ImageScroller
                    images={imageUrl}
                    onLike={() => 'hello'}
                    postId=""
                />
            ) : null}
            {videoUrl ? (
                <InviewPort onChange={isInView}>
                    <Video
                        useNativeControls={true}
                        ref={videoRef}
                        style={{
                            width: windowWidth - 20,
                            height: (windowWidth * 5) / 4,
                            alignSelf: 'center',
                        }}
                        source={{ uri: videoUrl }}
                        resizeMode={ResizeMode.COVER}
                        onPlaybackStatusUpdate={(status) => {
                            setPlayBackStatus(() => status);
                        }}
                    />
                </InviewPort>
            ) : // </Pressable>
            null}
            {text ? <Text my={1}>{text}</Text> : null}
            <Flex direction="row" justifyContent="space-between">
                <HStack space={3} alignItems="center">
                    <HStack space={1} alignItems="center">
                        <IconButton
                            icon={
                                <Icon
                                    size="sm"
                                    as={AntDesign}
                                    name={isPostLiked ? 'heart' : 'hearto'}
                                    color="primary.400"
                                />
                            }
                            onPress={isPostLiked ? unlikePost : likePost}
                            disabled={isLiking}
                        />
                        <Text>{likes}</Text>
                    </HStack>
                    <HStack space={1} alignItems="center">
                        <IconButton
                            icon={
                                <Icon
                                    size="sm"
                                    as={AntDesign}
                                    name="message1"
                                    color="primary.400"
                                />
                            }
                            onPress={() =>
                                navigation.navigate('Comments', {
                                    postId,
                                    postText: text,
                                    postUsername: username,
                                })
                            }
                        />
                        <Text fontSize="md" mr={3}>
                            {comments}
                        </Text>
                    </HStack>
                </HStack>
                <HStack alignItems="center">
                    {auth?.userId === creatorId ? (
                        <IconButton
                            disabled={isRemoving}
                            icon={
                                <Icon
                                    as={Feather}
                                    name="trash-2"
                                    color="red.300"
                                    size="4"
                                />
                            }
                            onPress={() => deletePost()}
                        />
                    ) : null}

                    <IconButton
                        icon={
                            <Icon
                                color="red.500"
                                as={MaterialIcons}
                                name="report"
                            />
                        }
                        onPress={() =>
                            navigation.navigate('Report', {
                                post,
                            })
                        }
                    />
                </HStack>
            </Flex>
        </Flex>
    );
};
