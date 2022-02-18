import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail
} from 'firebase/auth';
import { LOCAL_USER_INFO } from '../constants/Storage';
import { User } from '../types/User';
import { firebaseApp, fireStore } from './firebase';
import { setDoc, doc } from 'firebase/firestore';
import { setLocalData } from './local';
import { FormValues } from '../components/RegisterForm';
import { FirebaseError } from 'firebase/app';
import { ErrorDict } from '../constants/Firebase';
import { async, getUA } from '@firebase/util';

export const initializeApp = async (localUser: User | null) => {
    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, async (user) => {
        if (user && !localUser) {
            // useris loggedin do nothing
        }
        if (!user && localUser) {
            try {
                const response = await signInWithEmailAndPassword(auth, localUser.email, localUser.password);
            } catch (error) {
                console.log(error);
            }
        }
    });
};

export const registerUser = async (registration: FormValues) => {
    const { email, password, fullname, type } = registration;
    const auth = getAuth(firebaseApp);
    try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        const res = await updateProfile(credentials.user, { displayName: fullname });
        await setDoc(doc(fireStore, 'users', credentials.user.uid), {
            loginInfo: {
                fullname,
                type,
                email,
                userId: credentials.user.uid,
            },
            userId: credentials.user.uid,
        });
        const { uid, refreshToken, displayName, phoneNumber } = credentials.user;
        return { user: { userId: uid, refreshToken, displayName, phoneNumber, email, password }, status: 'success' };
    } catch (error) {
        if (error instanceof FirebaseError) {
            console.log(error.code);
            return {
                status: 'failed',
                message: ErrorDict[error.code] || "Unexpected error try again",
            };
        }
    }

    return null;
};


export const loginUser = async ({ email, password}: {email: string; password: string}) =>{
    const auth = getAuth(firebaseApp);
    try {
        const credentials = await  signInWithEmailAndPassword(auth, email, password);
        const { uid, refreshToken, displayName, phoneNumber } = credentials.user;
        return { user: { userId: uid, refreshToken, displayName, phoneNumber, email, password }, status: 'success' };
    } catch (error) {
        if (error instanceof FirebaseError) {
            return {
                status: 'failed',
                message: ErrorDict[error.code] || "Unexpected error try again",
            };
        }
    }
}


export const logOut = async() =>{
    const auth = getAuth(firebaseApp);
    await signOut(auth);
}

export const sendRecoverPassword = async(email: string)=>{
    const auth = getAuth(firebaseApp);
    try {
    await sendPasswordResetEmail(auth, email);
    return {
        status: 'success',
        message: 'Email has been sent to you'
    }
        
    } catch (error) {
        if (error instanceof FirebaseError) {
            return {
                status: 'failed',
                message: ErrorDict[error.code] || "Unexpected error try again",
            };
        }
    }
}
