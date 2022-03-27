import React, {FC, useRef, useState} from 'react';
import { Avatar, Flex, HStack, Icon, IconButton, Text } from 'native-base';
import { Post } from '../types/Post';
import { Pressable, useWindowDimensions } from 'react-native';
import { DEFAULT_AVATAR_IMAGE } from '../constants/files';
import { ImageScroller } from './ImageScroller';
import  { AVPlaybackStatus, Video } from 'expo-av'
import { AntDesign } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '../types';

type PostProps = {
    post: Post
}




export const UserPost: FC<PostProps> = ({post}) => {
    const { width: windowWidth, height: windowHeight} = useWindowDimensions();
    const avatarUrl = post?.avartar?.photoUrl || DEFAULT_AVATAR_IMAGE;
    const username = post?.avartar?.username || "Unknown Username";
    const { mediaType = "None", imageUrl = [], videoUrl, text, comments, likes } = post;
    const [videoPlaybackStatus, setPlayBackStatus] = useState<AVPlaybackStatus>();
    const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
    const videoRef = useRef(null);
    return(
        <Flex width={windowWidth} px={2} mb={5}>
            <Pressable onPress={() => navigation.navigate('ProfilePreview', { userId: post.creatorId})}>
            <HStack space={2} alignItems="center" py={1}>
                <Avatar size="md" source={{uri: avatarUrl}} >{username.slice(0, 2)}</Avatar>
                <Text fontSize="sm" fontWeight="bold">{username}</Text>
            </HStack>
            </Pressable>
            
            {
                imageUrl.length ? (
                    <ImageScroller images={imageUrl} onLike = {()=> "hello"}  postId = ""/>
                ):
                null
            }
            {
                videoUrl ? (
                    <Video
                    ref = {videoRef}
                    style = {{width: windowWidth - 20, height: windowWidth * 5/4, alignSelf: 'center'}}
                    source = {{uri: videoUrl}}
                    resizeMode = "cover"
                    shouldPlay = {true}

                     />

                ):
                null
            }
            {
                text ? (
                    <Text my={1}>{text}</Text>
                ):null
            }

            <HStack space={3} alignItems="center">
                <HStack space={1} alignItems="center">
                <IconButton icon = {<Icon size="sm" as = {AntDesign} name = "hearto" color="primary.400" />} />
                <Text>{likes}</Text>
                </HStack>
                <HStack space={1} alignItems="center">
                <IconButton icon = {<Icon size="sm" as = {AntDesign} name = "message1" color="primary.400" />} />
                <Text fontSize="md" mr={3}>{comments}</Text>
                </HStack>  
            </HStack>


        </Flex>
    )
}