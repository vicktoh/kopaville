import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ArrowBackIcon, FlatList, Flex, Heading, IconButton, useToast } from 'native-base';
import React, {FC, useEffect, useState} from 'react';
import { ActivityIndicator, ListRenderItemInfo } from 'react-native';
import { EmptyState } from '../components/EmptyeState';
import { UserListItem } from '../components/UserListItem';
import { useAppSelector } from '../hooks/redux';
import { exploreUsers } from '../services/postsServices';
import { HomeStackParamList } from '../types';
import { Profile } from '../types/Profile';





export const ExploreUsersScreen : FC = () =>{


    const {auth, profile} = useAppSelector(({auth, profile}) => ({ auth, profile}));
    const [loading, setLoading] = useState<boolean>();
    const [users, setUsers] = useState<Profile[]| null> ();
    const [refresh, setRefresh] = useState<boolean>(false);
    const toast = useToast();
    const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

    useEffect(()=>{
        const fetchusers = async()=>{
            try {
                setLoading(true);
                const data = await exploreUsers(profile?.profile?.servingState);
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
        return (<UserListItem  profile={listItem.item}/>)
    }
    return(
        <Flex flex = {1} bg="white" >
            <Flex direction = "row" alignItems="center" my = {2}>
                <IconButton icon = {<ArrowBackIcon/>} onPress = {()=> navigation.goBack()} />
                <Heading fontSize="md" ml ={5}>Find Friends</Heading>
            </Flex>
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