import { FlatList, Flex, useToast } from 'native-base';
import React, {FC, useEffect, useState} from 'react';
import { ActivityIndicator, ListRenderItemInfo } from 'react-native';
import { EmptyState } from '../components/EmptyeState';
import { UserListItem } from '../components/UserListItem';
import { useAppSelector } from '../hooks/redux';
import { Follower } from '../services/followershipServices';
import { exploreUsers } from '../services/postsServices';
import { Profile } from '../types/Profile';
import { LoadingScreen } from './LoadingScreen';





export const ExploreUsersScreen : FC = () =>{


    const {auth, profile, followerships} = useAppSelector(({auth, profile, followerships}) => ({ auth, profile, followerships }));
    const [loading, setLoading] = useState<boolean>();
    const [users, setUsers] = useState<Profile[]| null> ();
    const [refresh, setRefresh] = useState<boolean>(false);
    const toast = useToast();

   

    useEffect(()=>{
        const fetchusers = async()=>{
            try {
                setLoading(true);
                let following = [...(followerships?.following?.map(({userId}) => userId) || []), auth?.userId || ""];
                const data = await exploreUsers(following);
                setUsers(data);
            } catch (error) {
                const err: any = error;
                console.log(err);
                toast.show({placement: 'top', status: 'error', title: 'Error Occured', description: err?.message || "Something went wrong, Please ensure you have good internet connection and try again"})
            }
            finally{
                setLoading(false);
            }
        }
        fetchusers();
    }, [profile?.profile])

    const renderItem = (listItem: ListRenderItemInfo<Profile>) =>{
        const {loginInfo: {username, fullname}, userId, profileUrl} = listItem.item;
        const follower: Follower = { username, fullname, userId, photoUrl: profileUrl || ""}
        return (<UserListItem  profile={listItem.item}/>)
    }
    if(loading){
        return <LoadingScreen label='fetching users' />
    }
    return(
        <Flex flex = {1} bg="white" py={5} >
            {
                loading && !users?.length ? 
                <ActivityIndicator />: 
                
                    users?.length ? (
                        <FlatList data = {users} renderItem = {renderItem} keyExtractor = {(item, i) => `explore-u-${item?.userId || i}`} />
                    ):
                    <EmptyState  />
                
            }
        </Flex>
    )
}