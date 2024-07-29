import { LOCAL_SYSTEM_INFO, LOCAL_USER_INFO } from '../constants/Storage';
import { User } from '../types/User';
import { auth, firestore, functions } from './firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, reauthenticateWithCredential, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';

import { removeLocalData, setLocalData } from './local';
import { FormValues } from '../components/RegisterForm';
import { ErrorDict } from '../constants/Firebase';

import { Block } from '../types/Profile';
import { doc, getDoc, runTransaction, setDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

export const initializeApp = async (localUser: User | null) => {
    // const auth = firebase.auth(firebaseApp);
     onAuthStateChanged(auth, async(user) =>{
        if(user && !localUser){

        }
        if(!user && localUser){
            try {
                
                const response = await signInWithEmailAndPassword(auth, localUser.email, localUser.password);
            } catch (error) {
                console.log(error);
            }
        }
     })

    
};

export const registerUser = async (registration: FormValues) => {
    const { email, password, fullname, type, username, gender } = registration;
    try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        
        const res = await updateProfile(credentials.user, { displayName: fullname });
        await setDoc(doc(firestore,`users/${auth?.currentUser?.uid}`),{
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
    try {
        const credentials = await  signInWithEmailAndPassword(auth, email, password);
        const { uid, refreshToken, displayName, phoneNumber } = credentials.user || {};
        return { user: { userId: uid, refreshToken, displayName, phoneNumber, email, password }, status: 'success' };
    } catch (error) {
        const err: any = error;
        if (err) {
            console.log(err,)
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
    await  signOut(auth)
   
    
}

export const usernameExists = async (username: string)=>{
    const snap = await getDoc(doc(firestore,`usernames/${username.toLocaleLowerCase()}`));
    if(snap.exists()) return true
    return false
}

export const sendRecoverPassword = async(email: string)=>{
    try {
    await sendPasswordResetEmail(auth, email);
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


export const listenOnBlocks= async (userId: string, callback: (data: Block)=>void) => {
    const documentRef = doc(firestore,`blocks/${userId}`);
    const documennt = await getDoc(documentRef)
    const data = documennt.data() as Block;
    callback(data as Block);
    
}

export const blockUser = async (data: {blockerId: string; blockeeId: string}, block: Block | null) => {
    const blockeeRef = doc(firestore,`blocks/${data.blockeeId}`);
    const blockerRef = doc(firestore, `blocks/${data.blockerId}`);
    
    await runTransaction(firestore, async (transaction)=> {
        const blockee = await transaction.get(blockeeRef);
        
        if(blockee.exists()){
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
    const blockeeRef = doc(firestore, `blocks/${data.blockeeId}`);
    const blockerRef = doc(firestore, `blocks/${data.blockerId}`);
    
    
    await runTransaction(firestore, async (transaction)=> {
        const blockee = await transaction.get(blockeeRef);
        
        if(blockee.exists()){
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


export const deleteAccount = async()=> {

   const deleteUser = httpsCallable(functions, 'deleteUser');
   return await deleteUser();
}
