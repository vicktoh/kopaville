import { string } from 'yup';
import { Chat, ChatType, Conversation } from '../types/Conversation';
import { firebaseApp, firestore } from './firebase';

import { Recipient } from '../types/Conversation';
import { fromUnixTime } from 'date-fns';
import { Business, Job } from '../types/Job';
import { sendNotification } from './notifications';
import { Post } from '../types/Post';
import { addDoc, collection, doc, limit, onSnapshot, orderBy, query, Timestamp, updateDoc, writeBatch } from 'firebase/firestore';

export const startConversationWithMessage = async (
    from: Recipient,
    to: Recipient,
    message: string,
    onsuccess: (data: string) => void,
    type?: ChatType,
    link?: string,
    title?: string,
    job?: Job & Business,
    post?: Post
) => {
    const batch = writeBatch(firestore);
    const conversationRef = doc(collection(firestore, 'conversations'));
    const fromRef = doc(firestore,
        `users/${from.userId}/conversations/${conversationRef.id}`
    );
    const toRef = doc(firestore,
        `users/${to.userId}/conversations/${conversationRef.id}`
    );
    const messageRef = doc(collection(firestore,`conversations/${conversationRef.id}/chats/`));
    const newConversation: Omit<Conversation, 'dateCreated' | 'dateUpdated'> & {
        dateCreated: Timestamp;
        dateUpdated: Timestamp;
    } = {
        dateCreated: Timestamp.now(),
        memberIds: [from.userId, to.userId],
        members: [from, to],
        type: 'single',
        dateUpdated: Timestamp.now(),
        conversationId: conversationRef.id,
    };
    const newChat: Chat = {
        fromId: from.userId,
        toId: to.userId,
        fromUsername: from.username,
        message,
        conversationId: conversationRef.id,
        timestamp: Timestamp.now(),
        ...(type ? { type } : {}),
        ...(link ? { link } : {}),
        ...(title ? { title } : {}),
        ...(job ? { job } : {}),
        ...(post ? { post } : {}),
    };
    batch.set(conversationRef, newConversation);
    batch.set(fromRef, { ...newConversation, unreadCount: 0 });
    batch.set(toRef, { ...newConversation, unreadCount: 0 });
    batch.set(messageRef, newChat);
    await batch.commit();
    const notificationMessage = `Message from ${from.fullname}`;
    sendNotification(notificationMessage, to.userId)
    onsuccess(conversationRef.id);
};

export const sendMessage = async (
    conversationId: string,
    to: Recipient,
    from: Recipient,
    message: string,
    type?: ChatType,
    link?: string,
    title?: string,
    job?: Job & Business,
    post?: Post
) => {
    const newChat: Chat = {
        fromId: from.userId,
        toId: to.userId,
        fromUsername: from.username,
        message,
        conversationId,
        timestamp: Timestamp.now(),
        ...(type ? { type } : {}),
        ...(link ? { link } : {}),
        ...(title ? { title } : {}),
        ...(job ? { job } : {}),
        ...(post ? { post } : {}),
    };
    await addDoc(collection(firestore,`conversations/${conversationId}/chats`),newChat);
    const notificationMessage = `Message from ${from.fullname}`;
    sendNotification(notificationMessage, to.userId)
};

export const markAsRead = async (conversationId: string, userId: string) => {
   const msgDoc =doc(firestore, `users/${userId}/conversations/${conversationId}`)
   return updateDoc(msgDoc, { unreadCount: 0 });
};

export const conversationExists = (toUser: string, chats: Conversation[]) => {
    let conversationId: null |string = null;

    chats.forEach((chat) => {
        if (chat.memberIds.includes(toUser)) {
            conversationId = chat.conversationId;
        }
    });
    return conversationId;
};

export const listenOnChats = (
    conversationId: string,
    onsuccessCallback: (data: any) => void
) => {
    const chatCollection = collection(firestore, `conversations/${conversationId}/chats`)
    const q = query(chatCollection,orderBy('timestamp', 'asc'), limit(50) )
    return onSnapshot(q, (snapshot) => {
            const chats: Chat[] = [];

            snapshot.forEach((snap) => {
                const chat = snap.data() as Chat;
                chat.id = snap.id;
                chats.push(chat);
            });
            onsuccessCallback(chats);
        });
};
