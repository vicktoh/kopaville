import firebase from 'firebase';
import { string } from 'yup';
import { Chat, ChatType, Conversation } from '../types/Conversation';
import { firebaseApp } from './firebase';

import { Recipient } from '../types/Conversation';
import { fromUnixTime } from 'date-fns';
import { Business, Job } from '../types/Job';

export const startConversationWithMessage = async (
    from: Recipient,
    to: Recipient,
    message: string,
    onsuccess: (data: string) => void,
    type?: ChatType,
    link?: string,
    title?: string,
    job?: Job & Business
) => {
    const db = firebase.firestore(firebaseApp);
    const batch = db.batch();
    const conversationRef = db.collection('conversations').doc();
    const fromRef = db.doc(
        `users/${from.userId}/conversations/${conversationRef.id}`
    );
    const toRef = db.doc(
        `users/${to.userId}/conversations/${conversationRef.id}`
    );
    const messageRef = db
        .collection(`conversations/${conversationRef.id}/chats/`)
        .doc();
    const newConversation: Omit<Conversation, 'dateCreated' | 'dateUpdated'> & {
        dateCreated: firebase.firestore.Timestamp;
        dateUpdated: firebase.firestore.Timestamp;
    } = {
        dateCreated: firebase.firestore.Timestamp.now(),
        memberIds: [from.userId, to.userId],
        members: [from, to],
        type: 'single',
        dateUpdated: firebase.firestore.Timestamp.now(),
        conversationId: conversationRef.id,
    };
    const newChat: Chat = {
        fromId: from.userId,
        toId: to.userId,
        fromUsername: from.username,
        message,
        conversationId: conversationRef.id,
        timestamp: firebase.firestore.Timestamp.now(),
        ...(type ? { type } : {}),
        ...(link ? { link } : {}),
        ...(title ? { title } : {}),
        ...(job ? { job } : {}),
    };
    batch.set(conversationRef, newConversation);
    batch.set(fromRef, { ...newConversation, unreadCount: 0 });
    batch.set(toRef, { ...newConversation, unreadCount: 0 });
    batch.set(messageRef, newChat);
    await batch.commit();
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
    job?: Job & Business
) => {
    const db = firebase.firestore(firebaseApp);
    const newChat: Chat = {
        fromId: from.userId,
        toId: to.userId,
        fromUsername: from.username,
        message,
        conversationId,
        timestamp: firebase.firestore.Timestamp.now(),
        ...(type ? { type } : {}),
        ...(link ? { link } : {}),
        ...(title ? { title } : {}),
        ...(job ? { job } : {}),
    };
    await db.collection(`conversations/${conversationId}/chats`).add(newChat);
};

export const markAsRead = async (conversationId: string, userId: string) => {
    const db = firebase.firestore(firebaseApp);
    return db
        .doc(`users/${userId}/conversations/${conversationId}`)
        .update({ unreadCount: 0 });
};

export const conversationExists = (toUser: string, chats: Conversation[]) => {
    let conversationId = null;

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
    const db = firebase.firestore(firebaseApp);

    return db
        .collection(`conversations/${conversationId}/chats`)
        .orderBy('timestamp', 'asc')
        .limit(50)
        .onSnapshot((snapshot) => {
            const chats: Chat[] = [];

            snapshot.forEach((snap) => {
                const chat = snap.data() as Chat;
                chat.id = snap.id;
                chats.push(chat);
            });
            onsuccessCallback(chats);
        });
};
