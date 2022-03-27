import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ArrowBackIcon, FlatList, Flex, Heading, IconButton, useToast } from 'native-base';
import React, {FC, useEffect, useState} from 'react';
import { ActivityIndicator, ListRenderItemInfo } from 'react-native';
import { EmptyState } from '../components/EmptyeState';
import { UserPost } from '../components/UserPost';
import { useAppSelector } from '../hooks/redux';
import { explorePosts } from '../services/postsServices';
import { HomeStackParamList } from '../types';
import { Post } from '../types/Post';





export const ExplorePostScreen: FC = () => {
    const {auth, profile} = useAppSelector(({auth, profile}) => ({ auth, profile}));
    const [loading, setLoading] = useState<boolean>();
    const [posts, setPosts] = useState<(Post & {id?:string})[]| null> ();
    const [refresh, setRefresh] = useState<boolean>(false);
    const toast = useToast();
    const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

    useEffect(()=>{
        const fetchPosts = async()=>{
            try {
                setLoading(true);
                const data = await explorePosts();
                setPosts(data);
            } catch (error) {
                const err: any = error;
                console.log(err);
                toast.show({placement: 'top', status: 'error', title: 'Error Occured', description: err?.message || "Something went wrong, Please ensure you have good internet connection and try again"})
            }
            finally{
                setLoading(false);
            }
        }
        fetchPosts();
    }, [profile?.profile])

    const renderItem = (listItem: ListRenderItemInfo<Post>) =>{
        return <UserPost post= { listItem.item}  />
    }
    return(
        <Flex flex = {1} bg="white" py={5} >
            
            {
                loading && !posts?.length ? 
                <ActivityIndicator />: 
                
                    posts?.length ? (
                        <FlatList data = {posts} renderItem = {renderItem} keyExtractor = {(item, i) => `explore-${item?.id || i}`} />
                    ):
                    <EmptyState  />
                
            }
        </Flex>
    )
}