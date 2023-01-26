import { AntDesign } from '@expo/vector-icons';
import {
    Button,
    FlatList,
    Flex,
    Icon,
    IconButton,
    Input,
    ScrollView,
    useToast,
} from 'native-base';
import React, { FC, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    ListRenderItemInfo,
    useWindowDimensions,
} from 'react-native';
import { EmptyState } from '../components/EmptyeState';
import { UserListItem } from '../components/UserListItem';
import { useAppSelector } from '../hooks/redux';
import { useSearchIndex } from '../hooks/useSearchIndex';
import { Follower } from '../services/followershipServices';
import { Profile } from '../types/Profile';
import { LoadingScreen } from './LoadingScreen';
const USER_PERPAGE = 10;
export const ExploreUsersScreen: FC = () => {
    const { auth, profile, followerships } = useAppSelector(
        ({ auth, profile, followerships }) => ({ auth, profile, followerships })
    );
    const followersFilter = useMemo(()=> {
      return (followerships?.following || []).map((follower)=> `NOT userId:"${follower.userId}"`).join(' AND ')
    }, [followerships]);
    const { width: windowWidth, height } = useWindowDimensions();
    const {
        loading,
        data: users,
        page,
        pageStat,
        setPage,
        setQuery,
    } = useSearchIndex<Profile>('users', followersFilter, USER_PERPAGE, true);
    // const [users, setUsers] = useState<Profile[]| null> ();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>('');
    const toast = useToast();

    const onSearch = () => {
        setPage(0);
        setQuery(searchInput);
    };

    const renderItem = (listItem: ListRenderItemInfo<Profile>) => {
        const {
            loginInfo: { username, fullname },
            userId,
            profileUrl,
        } = listItem.item;
        const follower: Follower = {
            username,
            fullname,
            userId,
            photoUrl: profileUrl || '',
        };
        return <UserListItem profile={listItem.item} />;
    };

    const renderFooter = ()=> {
        return (
            <>
            {(pageStat?.total || 0) > page * USER_PERPAGE ? (
            <Button
                size="sm"
                alignSelf="center"
                my={5}
                onPress={()=> setPage(page + 1)}
                isLoading={loading}
            >
                Load More
            </Button>
        ) : null}
            </>
        )
        
    }
    if (loading && !users?.length) {
        return <LoadingScreen label="fetching users" />;
    }
    return (
        <Flex
            display="flex"
            flex={1}
            bg="white"
            width={windowWidth}
            pt={5}
        >
            <Flex
                direction="row"
                px={5}
                width={windowWidth}
                alignItems="center"
                py={5}
                borderWidth="1"
                borderColor="primary.200"
            >
                <Input
                    value={searchInput}
                    onChangeText={(text) => {
                        setSearchInput(text);
                    }}
                    onEndEditing={onSearch}
                    placeholder="Search  User"
                    maxWidth={300}
                />{' '}
                <IconButton
                    onPress={onSearch}
                    variant="solid"
                    colorScheme="primary"
                    size="md"
                    icon={<Icon as={AntDesign} name="search1" />}
                />
            </Flex>

            {loading && !users?.length ? (
                <ActivityIndicator />
            ) : users?.length ? (
                <>
                    <FlatList
                        data={users}
                        renderItem={renderItem}
                        keyExtractor={(item, i) =>
                            `explore-u-${item.userId}`
                        }
                        ListFooterComponent={renderFooter()}
                    />
                    
                </>
            ) : (
                <EmptyState />
            )}
        </Flex>
    );
};
