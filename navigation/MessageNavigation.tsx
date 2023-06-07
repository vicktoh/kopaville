import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MessageStackParamList } from '../types';
import { MessageListScreen } from '../screens/MessageListScreen';
import { MessageBubbleScreen } from '../screens/MessageBubbleScreen';

const MessageStack = createNativeStackNavigator<MessageStackParamList>();

export const MessageNavigation = () => {
    return (
        <MessageStack.Navigator initialRouteName="MessageList">
                <MessageStack.Screen name="MessageList" component={MessageListScreen} options={{ headerTitle: 'Chats', headerStyle: {
                    backgroundColor: 'white',
                }, headerTitleStyle: { color: 'black'} }} />
                <MessageStack.Screen name="MessageBubble" component={MessageBubbleScreen} options={{ headerShown: false, headerStyle: {
                    backgroundColor: 'white',
                }, headerTitleStyle: { color: 'black'} }} />
        </MessageStack.Navigator>
    );
};
