import { faP } from '@fortawesome/free-solid-svg-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, Badge, Button, Flex, Heading, HStack, Pressable, Text, useToast, VStack } from 'native-base';
import React, { FC, useEffect, useState } from 'react';
import { ListRenderItemInfo, TouchableOpacity, useWindowDimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { EmptyState } from '../components/EmptyeState';
import { UserListItem } from '../components/UserListItem';
import { useSearchIndex } from '../hooks/useSearchIndex';
import { fetchFollowers } from '../services/followershipServices';
import { getInitialsFromName } from '../services/helpers';
import { HomeStackParamList } from '../types';
import { Profile } from '../types/Profile';
import { LoadingScreen } from './LoadingScreen';
type FollowingProps = NativeStackScreenProps<HomeStackParamList, 'Following'>;
const USER_PERPAGE = 100;
export const Following: FC<FollowingProps> = ({ navigation, route }) => {
    const { profile, tab } = route.params;
    const [followersIDS, setFollowersIDS] = useState<string[]>();
    const [followingIDS, setFollowingIDS] = useState<string[]>();
    const [followLoading, setFollowingLoading] = useState(true);
    const [followersLoading, setFollowersLoading] = useState(true);
    const { width: WINDO_WIDTH} = useWindowDimensions();
    const [activeTab, setActiveTab] = useState<'following' | 'followers'>(
       tab || 'following'
    );
    const {
        loading: followerLoading,
        data: followers,
        setData: setDataFollowers,
        setPage: setFollowersPage,
        page: followersPage,
        pageStat: followersPageStats,
        setFacets: setFollowerFacet,
        setReady: setFollwersReady,
    } = useSearchIndex<Profile>(
        'users',
        '',
        USER_PERPAGE,
        false,
        false,
    );
    const {
        loading: followingLoading,
        data: following,
        setData: setDataFollowing,
        setPage: setFollowingPage,
        page: followingPage,
        pageStat: followingPageStats,
        setFacets: setFollowingFacets,
        setReady: setFollowingReady,
    } = useSearchIndex<Profile>(
        'users',
        '',
        USER_PERPAGE,
        false,
        false
    );
    const toast = useToast();
    
    useEffect(() => {
        const getFollowers = async () => {
            try {
                setFollowersLoading(true);
                if (!profile?.userId) return;
                const followers = await fetchFollowers(
                    profile.userId,
                    'followers'
                );
                const followerFacet = followers.map(
                    (userId) => `userId:${userId}`
                );
               //  console.log({followerFacet})
               if(followerFacet.length){
                  setFollowerFacet([followerFacet]);
                  setFollowersIDS(followers);
                  setFollwersReady(true);
               }{
                  setDataFollowers([])
               }
            } catch (error) {
                toast.show({
                    title: 'Something went wrong',
                    variant: 'subtle',
                });
            } finally {
                setFollowersLoading(false);
            }
        };
        getFollowers();
    }, []);
    useEffect(() => {
        const getFollowing = async () => {
            try {
                setFollowingLoading(true);
                if (!profile?.userId) return;
                const following = await fetchFollowers(
                    profile.userId,
                    'following'
                );
                const followingFacets = following.map(
                    (userId) => `userId:${userId}`
                );
               //  console.log({followingFacets})
               if(followingFacets.length){
                  setFollowingFacets([followingFacets]);
                  setFollowingIDS(following);
                  setFollowingReady(true);
               }else{
                  setDataFollowing([])
               }
            } catch (error) {
                console.log(error)
                toast.show({
                    title: 'Something went wrong',
                    variant: 'subtle',
                });
            } finally {
                setFollowingLoading(false);
            }
        };
        getFollowing();
    }, []);


    const renderItem = (listItem: ListRenderItemInfo<Profile>) => {
        const {
            loginInfo: { username, fullname },
            userId,
            profileUrl,
        } = listItem.item;

        return <UserListItem showFollow={false} profile={listItem.item} />;
    };
    const renderFollowerFooter = () => {
        return (
            <>
                {(followersPageStats?.total || 0) >
                (followersPage + 1) * USER_PERPAGE ? (
                    <Button
                        size="sm"
                        alignSelf="center"
                        my={5}
                        onPress={() => setFollowersPage(followersPage + 1)}
                        isLoading={followerLoading}
                    >
                        Load More
                    </Button>
                ) : null}
            </>
        );
    };
    const renderFollowingFooter = () => {
        return (
            <>
                {(followingPageStats?.total || 0) >
                (followingPage + 1) * USER_PERPAGE ? (
                    <Button
                        size="sm"
                        alignSelf="center"
                        my={5}
                        onPress={() => setFollowingPage(followingPage + 1)}
                        isLoading={followingLoading}
                    >
                        Load More
                    </Button>
                ) : null}
            </>
        );
    };


    return (
        <Flex flex={1} bg="white" px={2}>
            <HStack space={2} ml={3} py={5}>
                <Avatar
                    source={{ uri: profile?.profileUrl || '' }}
                    backgroundColor="primary.500"
                    _text={{ color: 'white' }}
                >
                    {getInitialsFromName(profile?.loginInfo?.fullname || '')}
                </Avatar>
                <VStack flexShrink={1} maxWidth={WINDO_WIDTH}>
                    <Heading  flexWrap="wrap">{profile?.loginInfo?.fullname || ''}</Heading>
                    <Text>@{profile?.loginInfo?.username || ''}</Text>
                </VStack>
            </HStack>
            <Flex
                direction="row"
                alignItems="center"
                my={5}
                justifyContent="space-around"
            >
                <Pressable
                    flex={1}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    paddingY={3}
                    paddingX={5}
                    borderBottomWidth={activeTab === 'following' ? 2 : 0}
                    borderBottomColor="primary.300"
                    color={activeTab == 'following' ? 'primary.300' : 'black'}
                    onPress={() => setActiveTab('following')}
                    disabled={activeTab === 'following'}
                >
                    <HStack alignItems="center">
                        <Text
                            color={
                                activeTab == 'following'
                                    ? 'primary.300'
                                    : 'black'
                            }
                        >
                            Following
                        </Text>
                        <Badge
                            size="xs"
                            rounded="full"
                            backgroundColor={
                                activeTab === 'following'
                                    ? 'primary.400'
                                    : 'gray.300'
                            }
                            _text={{
                                color:
                                    activeTab === 'following'
                                        ? 'white'
                                        : 'black',
                            }}
                            color={
                                activeTab === 'following' ? 'white' : 'black'
                            }
                            ml={3}
                        >
                            {profile?.followerships?.following || 0}
                        </Badge>
                    </HStack>
                </Pressable>
                <Pressable
                    flex={1}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    paddingY={3}
                    paddingX={5}
                    onPress={() => setActiveTab('followers')}
                    disabled={activeTab === 'followers'}
                    borderBottomWidth={activeTab === 'followers' ? 2 : 0}
                    borderBottomColor="primary.300"
                    color={activeTab == 'followers' ? 'primary.300' : 'black'}
                >
                    <HStack alignItems="center" space={3}>
                        <Text
                            color={
                                activeTab == 'followers'
                                    ? 'primary.300'
                                    : 'black'
                            }
                        >
                            Followers
                        </Text>
                        <Badge
                            size="xs"
                            rounded="full"
                            backgroundColor={
                                activeTab === 'followers'
                                    ? 'primary.400'
                                    : 'gray.300'
                            }
                            _text={{
                                color:
                                    activeTab === 'followers'
                                        ? 'white'
                                        : 'black',
                            }}
                        >
                            {profile?.followerships?.followers || 0}
                        </Badge>
                    </HStack>
                </Pressable>
            </Flex>
            {followLoading || followersLoading ? <LoadingScreen /> : null}
            {!followerLoading && !followersLoading ? (
                <FlatList
                    ListEmptyComponent={
                        <EmptyState
                            title={
                                activeTab === 'followers'
                                    ? 'No Followers'
                                    : 'Following None'
                            }
                            description={
                                activeTab === 'followers'
                                    ? 'This user has no follower'
                                    : 'this user follows nobody'
                            }
                        />
                    }
                    data={
                        activeTab === 'followers'
                            ? followers || []
                            : following || []
                    }
                    renderItem={renderItem}
                    keyExtractor={(item, i) =>
                        `${activeTab}-${item.loginInfo.email}`
                    }
                    ListFooterComponent={activeTab === "followers" ? renderFollowerFooter: renderFollowingFooter}
                />
            ) : null}
        </Flex>
    );
};
