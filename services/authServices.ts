import { LOCAL_SYSTEM_INFO, LOCAL_USER_INFO } from '../constants/Storage';
import { User } from '../types/User';
import { firebaseApp } from './firebase';
import firebase from 'firebase';

import { removeLocalData, setLocalData } from './local';
import { FormValues } from '../components/RegisterForm';
import { ErrorDict } from '../constants/Firebase';
import { async, getUA } from '@firebase/util';

import { persistor } from '../reducers/store';

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
    await persistor.purge();
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
