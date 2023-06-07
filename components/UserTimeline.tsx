import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Button, FlatList, Flex, Heading, Text } from 'native-base';
import React, { FC, useState } from 'react';
import { ListRenderItemInfo } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../hooks/redux';
import { setPosts } from '../reducers/postSlice';
import { LoadingScreen } from '../screens/LoadingScreen';
import { listenOnTimeline } from '../services/postsServices';
import { HomeStackParamList } from '../types';
import { Post } from '../types/Post';
import { UserPost } from './UserPost';

type UserTimelineProps = {};
const EmptyTimeline: FC = () => {
    const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
    const { systemInfo } = useAppSelector(({ systemInfo }) => ({ systemInfo }));

    return (
        <Flex
            mx={5}
            flex={systemInfo?.checkList ? 2 : 1}
            mt={4}
            direction="column"
            justifyContent="center"
            borderWidth={1}
            borderColor="primary.500"
            p={10}
            borderRadius="xl"
        >
            <Heading size="md" color="primary.500" my={3}>
                You have no content Yet!!
            </Heading>
            <Text textAlign="center" lineHeight="xl">
                Post from people other corpers will show here
            </Text>
            <Button
                borderRadius="full"
                variant="outline"
                my={3}
                colorScheme="primary"
                onPress={() => navigation.navigate('Explore Post')}
            >
                Explore 💫
            </Button>
            <Button
                borderRadius="full"
                bg="secondary.500"
                _text={{ color: 'primary.500' }}
                onPress={() => navigation.navigate('Explore Users')}
            >
                Find My Friends
            </Button>
        </Flex>
    );
};
export const UserTimeline: FC<UserTimelineProps> = () => {
    const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
    const { posts, followerships, block, auth, systemInfo } = useAppSelector(
        ({ posts, followerships, block, auth, systemInfo }) => ({
            posts,
            followerships,
            block,
            auth,
            systemInfo
        })
    );
    const dispatch = useDispatch();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [listener, setListener] = useState<()=>void>();
    const onOpenOption = (post: Post) => {
        navigation.navigate("Option", { post, postText: post.text,  userId: auth?.userId || ''});
    };
    // React.useEffect(() => {
        
    //     if (auth && followerships?.following) {
    //         try {
               
    //             const unsubscribe = listenOnTimeline(
    //                 [
    //                     ...(followerships?.following || []).map(
    //                         ({ userId }) => userId
    //                     ),
    //                     auth.userId,
    //                 ],
    //                 (data) =>{
    //                     setLoading(false)
    //                     dispatch(setPosts(data))},
    //                 (e) => console.log(e),
    //                 block?.blocked || []
    //             );
    //             setListener(unsubscribe);
    //             return unsubscribe;
    //         } catch (error) {
    //             setPosts('error');
    //             console.log(error);
    //         }
            
    //     }
    // }, [followerships?.following, auth, block, refresh]);
    const renderPostItem = (info: ListRenderItemInfo<Post>) => {
        return <UserPost onOpenOption={onOpenOption} post={info.item} key={`post-${info.index}`} />;
    };

    // const refreshPost = () => {
    //     if(listener) listener();
    //     setLoading(true);
    //     setRefresh((refr) => !!!refr);
    // };
    // console.log({posts})
    if (!posts) {
        return (
            <Flex flex={systemInfo?.checkList ? 2 : 1}>
                <LoadingScreen />
            </Flex>
        );
    }
    if (posts === "error") {
        return (
            <Flex flex={systemInfo?.checkList ? 2 : 1}>
                <Text>Something went wrong</Text>
                <Button >Refresh</Button>
            </Flex>
        );
    }

    if (typeof posts !== 'string' &&  posts?.length) {
        return (
            <Flex flex={systemInfo?.checkList ? 2 : 1}>
                <FlatList
                refreshing={loading}
                // onRefresh={refreshPost}
                keyExtractor={(item) => item.postId || ''}
                data={posts}
                renderItem={renderPostItem}
                style={{ flex: 1 }}
            />
            </Flex>
            
        );
    }

    return <EmptyTimeline />;
};
