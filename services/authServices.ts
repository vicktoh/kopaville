import { LOCAL_SYSTEM_INFO, LOCAL_USER_INFO } from '../constants/Storage';
import { User } from '../types/User';
import firebase from 'firebase';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseApp } from './firebase';

import { removeLocalData, setLocalData } from './local';
import { FormValues } from '../components/RegisterForm';
import { ErrorDict } from '../constants/Firebase';

import { persistor } from '../reducers/store';
import { Block } from '../types/Profile';
import axios, { AxiosRequestConfig } from 'axios';
import { BLOCK_USER_PATH } from '../constants/paths';
import { HttpResponse } from '../types/Report';

export const initializeApp = async (localUser: User | null) => {
    const auth = firebase.auth(firebaseApp);


    auth.onAuthStateChanged(async (user)=>{
        if(user && !localUser){

        }
        if(!user && localUser){
            try {
                const response = await auth.signInWithEmailAndPassword(localUser.email, localUser.password);
            } catch (error) {
                console.log(error);
            }
        }
    })
};

export const registerUser = async (registration: FormValues) => {
    const { email, password, fullname, type, username, gender } = registration;
    const auth = firebase.auth(firebaseApp);
    try {
        const credentials = await auth.createUserWithEmailAndPassword(email, password);
        
        const res = await auth.currentUser?.updateProfile({ displayName: fullname });
        await firebase.firestore(firebaseApp).doc(`users/${auth?.currentUser?.uid}`).set({
            loginInfo: {
                fullname,
                username,
                type,
                email,
                gender,
                userId: credentials?.user?.uid,
            },
            userId: credentials?.user?.uid,
            followerships: {
                followers: 0,
                following: 0
            }
        })
        
        const { uid, refreshToken, displayName, phoneNumber } = credentials.user || {};
        return { user: { userId: uid, refreshToken, displayName, phoneNumber, email, password }, status: 'success' };
    } catch (error) {
        const err: any = error;
        if (err) {
            return {
                status: 'failed',
                message: ErrorDict[err?.code] || "Unexpected error try again",
            };
        }
    }

    return null;
};


export const loginUser = async ({ email, password}: {email: string; password: string}) =>{
    const auth = firebase.auth(firebaseApp);
    try {
        const credentials = await  auth.signInWithEmailAndPassword(email, password);
        const { uid, refreshToken, displayName, phoneNumber } = credentials.user || {};
        return { user: { userId: uid, refreshToken, displayName, phoneNumber, email, password }, status: 'success' };
    } catch (error) {
        const err: any = error;
        if (err) {
            return {
                status: 'failed',
                message: ErrorDict[err?.code] || "Unexpected error try again",
            };
        }
    }
}


export const logOut = async() =>{
    await removeLocalData(LOCAL_USER_INFO);
    await removeLocalData(LOCAL_SYSTEM_INFO);
    await  firebase.auth(firebaseApp).signOut();
   
    
}

export const usernameExists = async (username: string)=>{
    const snap = await firebase.firestore().doc(`usernames/${username.toLocaleLowerCase()}`).get();
    if(snap.exists) return true
    return false
}

export const sendRecoverPassword = async(email: string)=>{
    const auth = firebase.auth(firebaseApp)
    try {
    await auth.sendPasswordResetEmail(email);
    return {
        status: 'success',
        message: 'Email has been sent to you'
    }
        
    } catch (error) {
        const err: any = error;
        if (err) {
            return {
                status: 'failed',
                message: ErrorDict[err.code] || "Unexpected error try again",
            };
        }
    }
}


export const listenOnBlocks= (userId: string, callback: (data: Block)=>void) => {
    const documentRef = firebase.firestore().doc(`blocks/${userId}`);
    return documentRef.onSnapshot((snap)=>{
        const data = snap.data();
        callback(data as Block);
    });
}

export const blockUser = async (data: {blockerId: string; blockeeId: string}, block: Block | null) => {
    const blockeeRef = firebase.firestore().doc(`blocks/${data.blockeeId}`);
    const blockerRef = firebase.firestore().doc(`blocks/${data.blockerId}`);
    
    await firebase.firestore().runTransaction(async (transaction)=> {
        const blockee = await transaction.get(blockeeRef);
        
        if(blockee.exists){
            const blockdata = blockee.data();
            transaction.update(blockeeRef, { blockedBy: [...(blockdata?.blockedBy || []), data.blockerId]});
        }
        else{
            transaction.set(blockeeRef, { blockedBy: [data.blockerId]});
        }

        transaction.set(blockerRef, { ...block, blocked : [...(block?.blocked || []), data.blockeeId]})
    })
}
export const unBlockUser = async (data: { blockerId:string, blockeeId: string}, newblocked: string []) => {
    const blockeeRef = firebase.firestore().doc(`blocks/${data.blockeeId}`);
    const blockerRef = firebase.firestore().doc(`blocks/${data.blockerId}`);
    
    
    await firebase.firestore().runTransaction(async (transaction)=> {
        const blockee = await transaction.get(blockeeRef);
        
        if(blockee.exists){
            const blockdata = blockee.data() as Block;
            const newBlockedBy = (blockdata?.blockedBy || []).filter((userid)=> userid !== data.blockerId);
            transaction.update(blockeeRef, { blockedBy: newBlockedBy});
        }
        else{
            // theres nothing to do for the blockee
        }
        transaction.update(blockerRef, { blocked: newblocked})
    });
}
