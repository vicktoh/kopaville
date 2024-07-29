import { NavigationProp, useNavigation } from '@react-navigation/native';
import {
    ArrowBackIcon,
    Button,
    FlatList,
    Flex,
    HStack,
    Heading,
    Icon,
    IconButton,
    Pressable,
    Spinner,
    Text,
    VStack,
    useDisclose,
    useToast,
} from 'native-base';
import React, { FC, useEffect, useState } from 'react';
import { ActivityIndicator, ListRenderItemInfo, Modal, View } from 'react-native';
import { EmptyState } from '../components/EmptyeState';
import { UserPost } from '../components/UserPost';
import { useAppSelector } from '../hooks/redux';
import { explorePosts, listenOnExplorePost, removePost, reportPost } from '../services/postsServices';
import { HomeStackParamList } from '../types';
import { Post, PostWithId } from '../types/Post';
import { LoadingScreen } from './LoadingScreen';
import { background } from 'native-base/lib/typescript/theme/styled-system';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { HalfScreenModal } from '../components/HalfScreenModal';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';

export const ExplorePostScreen: FC = () => {
    const { auth, profile, block } = useAppSelector(
        ({ auth, profile, block }) => ({ auth, profile, block })
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [posts, setPosts] = useState<(Post & { id?: string })[] | null>();
    const [refresh, setRefresh] = useState<boolean>(false);
    const { isOpen: isPostOptionOpen, onOpen: onOpenPostOption, onClose: onClosePostOption } = useDisclose();
    const [isRemoving, setIsRemoving] = useState(false)
    const [selectedPost, setSelectedPost] = useState<PostWithId>();
    const toast = useToast();
    const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
    const onOpenOption = (post: Post) => {
        navigation.navigate("Option", { post, postText: post.text,  userId: auth?.userId || ''});
    };
    const onReport = () => {
        console.log(selectedPost)
        if (!selectedPost) return;
        onClosePostOption();
        navigation.navigate("Report", { post: selectedPost})
    }
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                listenOnExplorePost(block?.blocked || [], (posts: Post[], err)=> {
                    setLoading(false);
                    if(err){
                        toast.show({
                            description: err,
                            placement: 'top',
                            duration: 3000,
                        })
                        return
                    }
                    setPosts(posts);
                })
            } catch (error) {
                const err: any = error;
                console.log(err);
                toast.show({
                    placement: 'top',
                    title: 'Error Occured',
                    description:
                        err?.message ||
                        'Something went wrong, Please ensure you have good internet connection and try again',
                });
            } finally {
                // setLoading(false);
            }
        };
        fetchPosts();
    }, [profile?.profile]);

    const renderItem = (listItem: ListRenderItemInfo<Post>) => {
        return <UserPost post={listItem.item} onOpenOption={()=> listItem.item.postId && onOpenOption(listItem.item)} />;
    };
    
    return (
        <Flex flex={1} bg="white" py={5}>
            {loading ? (
                <LoadingScreen />
            ) : posts?.length ? (
                <FlatList
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={(item, i) => `explore-${item?.id || i}`}
                />
            ) : (
                <EmptyState />
            )}

            
        </Flex>
    );
};
