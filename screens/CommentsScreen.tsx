import React, { FC, useEffect, useState } from 'react';
import firebase from 'firebase';
import { Entypo } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    Button,
    FlatList,
    Flex,
    Heading,
    Icon,
    IconButton,
    KeyboardAvoidingView,
    Text,
    TextArea,
    useToast,
} from 'native-base';
import { ActivityIndicator, ListRenderItemInfo, Platform } from 'react-native';
import { EmptyState } from '../components/EmptyeState';
import { useAppSelector } from '../hooks/redux';
import { commentOnPost, listenOnComments } from '../services/postsServices';
import { HomeStackParamList } from '../types';
import { Comment } from '../types/Comment';
import { PostComment } from '../components/PostComment';

type CommentScreenProps = NativeStackScreenProps<
    HomeStackParamList,
    'Comments'
>;

export const CommentsScreen: FC<CommentScreenProps> = ({
    navigation,
    route,
}) => {
    const { postId, postUsername, postText } = route.params;
    const { auth, profile } = useAppSelector(({ auth, profile }) => ({
        auth,
        profile,
    }));
    const [loading, setLoading] = useState<boolean>(false);
    const [commenting, setCommenting] = useState<boolean>(false);
    const [commentText, setCommentText] = useState<string>('');
    const [comments, setComments] = useState<Comment[]>([]);
    const toast = useToast();

    useEffect(() => {
        try {
            setLoading(true);
            const unsbscribe = listenOnComments(postId, (data) =>
                setComments(data)
            );
            return unsbscribe;
        } catch (error) {
            const err: any = error;
            console.log(error);
            toast.show({
                title: 'Error Occured',
                status: 'error',
                description:
                    'Could not post comment, make sure you have good internet connection',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const makeComment = async () => {
        try {
            const commentToPost: Comment = {
                comment: commentText,
                userId: auth?.userId || '',
                postId,
                photoUrl: profile?.profileUrl || '',
                username: profile?.loginInfo?.username || '',
                fullname: profile?.loginInfo?.fullname || '',
                date: firebase.firestore.Timestamp.now(),
            };
            setCommenting(true);
            await commentOnPost(commentToPost);
        } catch (error) {
            console.log(error);
        } finally {
            setCommentText('')
            setCommenting(false);
        }
    };
    const renderItem = (info: ListRenderItemInfo<Comment>) => {
        return <PostComment comment = {info.item}  />
    };
    return (
        <KeyboardAvoidingView flex={1}  bg="white"  behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Flex flex={1} p={5} pb={10}>
                <Flex direction="row" justifyContent="flex-end">
                    <IconButton
                        icon={<Icon color="primary.400" as={Entypo} name="circle-with-cross" />}
                        onPress={() => navigation.goBack()}
                    />
                </Flex>
                <Heading fontSize="md">{`Comment on ${postUsername}'s post`}</Heading>
                <Flex flex={1}>
                    {loading ? (
                        <Flex flex={1} alignItems="center">
                            <ActivityIndicator />
                        </Flex>
                    ) : comments.length ? (
                        <FlatList
                            renderItem={renderItem}
                            data={comments}
                            flex={1}
                            keyExtractor={(item, i)=> item.id || `comment-${i}-${postId}`}
                        />
                    ) : (
                        <EmptyState
                            title="No comments 💬 yet"
                            description="Be the first to comment"
                        />
                    )}
                    {loading ? null : (
                        <Flex>
                            <TextArea
                                value={commentText}
                                onChangeText={(text) => setCommentText(text)}
                                height={20}
                                borderColor="primary.400"
                                borderWidth={1}
                                placeholder="Your comment goes here"
                            />
                            <Button
                                variant="solid"
                                my={5}
                                disabled={commenting}
                                onPress={makeComment}
                                isLoading={commenting}
                                isLoadingText="posting"
                            >
                                Comment
                            </Button>
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </KeyboardAvoidingView>
    );
};
