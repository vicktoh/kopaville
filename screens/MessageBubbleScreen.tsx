import { FontAwesome } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    ArrowBackIcon,
    Button,
    Flex,
    FormControl,
    Heading,
    Icon,
    IconButton,
    KeyboardAvoidingView,
    ScrollView,
    TextArea,
    useToast,
} from 'native-base';
import React, { FC, useEffect, useRef, useState } from 'react';
import { ListRenderItemInfo, Platform, FlatList } from 'react-native';
import { MessageBubble } from '../components/MessageBubble';
import { useAppSelector } from '../hooks/redux';
import {
    listenOnChats,
    markAsRead,
    sendMessage,
    startConversationWithMessage,
} from '../services/messageServices';
import { MessageStackParamList } from '../types';
import { Chat, Recipient } from '../types/Conversation';

type MessageBubbleScreenProps = NativeStackScreenProps<
    MessageStackParamList,
    'MessageBubble'
>;

export const MessageBubbleScreen: FC<MessageBubbleScreenProps> = ({
    navigation,
    route,
}) => {
    const { recipient, conversationId } = route.params;
    const { auth, profile } = useAppSelector(({ auth, profile }) => ({
        auth,
        profile,
    }));
    const [conversation, setConversation] = useState<string | undefined>(
        conversationId
    );
    const [message, setMessage] = useState<string>('');
    const [chats, setChats] = useState<Chat[]>();
    const [loading, setLoading] = useState<boolean>();
    const [sendingChat, setSendingChat] = useState<boolean>();
    const flatListRef = useRef<any>();
    const toast = useToast();
    const { loginInfo, profileUrl } = profile || {};
    useEffect(() => {
        if (conversation) {
            const unsubscribe = listenOnChats(conversation, (data) => {
                setChats(data);
                flatListRef.current?.scrollToEnd({ animating: true });
            });
            return () => unsubscribe();
        }
    }, [conversation]);
    useEffect(()=>{
       if(chats){
          markAsRead(conversation || "", auth?.userId || "");
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animating: true }); 
          }, 800);
       }
    }, [chats])

    const sendMessageAndStartConversation = async () => {
        try {
            setSendingChat(true);
            const from: Recipient = {
                userId: auth?.userId || '',
                username: loginInfo?.username || '',
                photoUrl: profileUrl || '',
                fullname: loginInfo?.fullname || '',
            };

            await startConversationWithMessage(
                from,
                recipient,
                message,
                (data) => setConversation(data)
            );
        } catch (error) {
            console.log(error);
            toast.show({
                title: 'Error',
                description: 'Could not send chat',
                status: 'error',
            });
        } finally {
            setSendingChat(false);
        }
    };

    const sendMessageOnly = async (conversationId: string) => {
        const from: Recipient = {
            userId: auth?.userId || '',
            username: loginInfo?.username || '',
            photoUrl: profileUrl || '',
            fullname: loginInfo?.fullname || '',
        };
        try {
            const mess = message;
            setMessage('');

            await sendMessage(conversationId, recipient, from, message);
        } catch (error) {
            console.log(error);
            toast.show({
                title: 'Error',
                description: 'Could not send chat',
                status: 'error',
            });
        } finally {
            setMessage('');
            // flatListRef.current?.scrollToEnd({ animating: true });
        }
    };
    const renderMessageBubble = (item: ListRenderItemInfo<Chat>) => {
        return <MessageBubble chat={item.item} authId={auth?.userId || ''} />;
    };
    return (
        <KeyboardAvoidingView
            bg="white"
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Flex flex={1} bg="white" position="relative" px={5} safeArea>
                <IconButton
                    icon={<ArrowBackIcon />}
                    onPress={() => navigation.navigate('MessageList')}
                />
                <Heading
                    fontSize="md"
                    py={3}
                >{`Message  ${recipient?.fullname}`}</Heading>
                <FlatList
                    ref={flatListRef}
                    data={chats}
                    renderItem={renderMessageBubble}
                    keyExtractor={(item) =>
                        item?.id || `${item.timestamp.toMillis()}`
                    }
                />
                <Flex marginTop="auto">
                    <FormControl _text={{ fontSize: 'lg' }} isRequired mb={3}>
                        <TextArea
                            placeholder="write your message here"
                            height={20}
                            size="md"
                            value={message}
                            onChangeText={(text) => setMessage(text)}
                            variant="outline"
                            borderColor="primary.400"
                        />
                    </FormControl>
                    <Button
                        isLoadingText="Creating conversation"
                        isLoading={sendingChat}
                        mt={2}
                        size="lg"
                        variant="solid"
                        onPress={() =>
                            conversation
                                ? sendMessageOnly(conversation)
                                : sendMessageAndStartConversation()
                        }
                        colorScheme="primary"
                        mb={5}
                        leftIcon={
                            <Icon size="sm" as={FontAwesome} name="send" />
                        }
                    >
                        Send
                    </Button>
                </Flex>
            </Flex>
        </KeyboardAvoidingView>
    );
};
