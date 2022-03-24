import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Button, FlatList, Flex, Heading, Text } from 'native-base';
import React, { FC, useState } from 'react';
import { ListRenderItemInfo } from 'react-native';
import { useAppSelector } from '../hooks/redux';
import { HomeStackParamList } from '../types';
import { Post } from '../types/Post';
import { UserPost } from './UserPost';

type UserTimelineProps = {
   
};
const EmptyTimeline: FC = () =>{
    const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
    return (
        <Flex mx={5} flex={1} mt={3} direction="column" justifyContent="center" borderWidth={1} borderColor="primary.500" p= {10} borderRadius="xl">
            <Heading size="md" color="primary.500" my={3}>You have no content Yet!!</Heading>
            <Text lineHeight="xl">Post from people who you follow will appear here. Go to the explore page or find some people to follow</Text>
            <Button borderRadius="full" variant="outline" my={3} colorScheme='primary' onPress={()=> navigation.navigate("Explore Post")}>Explore 💫</Button>
            <Button borderRadius="full" bg="secondary.500" _text={{color: 'primary.500'}} onPress={()=> navigation.navigate("Explore Users")}>Find My Friends</Button>
        </Flex>
    )
}
export const UserTimeline: FC<UserTimelineProps> = () => {
    const posts = useAppSelector(({ posts }) => posts);
    const renderPostItem = (info: ListRenderItemInfo<Post>) =>{
        return (<UserPost post={info.item} key = {`post-${info.index}`} />)
    }
    console.log({posts})
    if(!posts){
        return (
            <Text>Loading</Text>
        )
    }
    
    if(posts.length){
        return(
            <FlatList keyExtractor={(item)=> item.postId || ""} data={posts} renderItem = {renderPostItem} style = {{flex: 1}} />
        )
    }

    return <EmptyTimeline />;

    
};



