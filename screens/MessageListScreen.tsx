import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Flex, Heading } from 'native-base';
import React, { FC } from 'react';
import { ListRenderItemInfo } from 'react-native';
import { ChatListItem } from '../components/ChatlistItem';
import { EmptyState } from '../components/EmptyeState';
import { useAppSelector } from '../hooks/redux';
import { MessageStackParamList } from '../types';
import { Conversation } from '../types/Conversation';

type MessageListScreenProps = NativeStackScreenProps<MessageStackParamList>;

export const MessageListScreen: FC<MessageListScreenProps> = () => {
    const { auth, chats } = useAppSelector(({ auth, chats }) => ({
        auth,
        chats,
    }));
    
    

    const renderConversationItem = ( item: ListRenderItemInfo<Conversation>) => {
       return <ChatListItem conversation={ item.item } authId= {auth?.userId || "" } />
    }
    

    if (!chats?.length) {
        return (
            <EmptyState description="You do not have any chat yet, initiate a chat with someone to get started" />
        );
    }
    return (
        <Flex flex = {1} py={2} bg = "white" px={5}>
            <FlatList data = {chats} renderItem = {renderConversationItem} keyExtractor= {({conversationId}) => conversationId } />
        </Flex>
    );
};
