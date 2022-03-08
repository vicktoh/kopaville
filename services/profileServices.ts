import { fireStore, firebaseApp } from './firebase';
import {  getDoc, doc,   updateDoc, FirestoreError } from '@firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable, uploadString} from 'firebase/storage'
import { async } from '@firebase/util';
import { Profile } from '../types/Profile';

export const fetchUserProfile = async(
    userId: string,
    onSuccessCallback:(data: any) => void
) => {
    const docRef = doc(fireStore, "users", userId);
    const snapshot = await  getDoc(docRef);
    if(snapshot.exists()){
        onSuccessCallback(snapshot.data())
    }
};


export const updateProfileInfo = async (userId:string, profile: Partial<Profile>)=>{
    const userRef = doc(fireStore, "users", userId );
    try {
        await updateDoc(userRef, profile);
        return { status: 'success'}
    } catch (error) {
        if (error instanceof FirestoreError){
            return {status: 'failed', message: error.message}

        }

        return { status: 'failed'}
    }
}
export const getUploadBlob = async (uri: string) => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
    });
    return blob as Blob;
}


export const uploadProfilePicture = async (userId: string, uri: string)=>{
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `profile_pics/${userId}`);
    const blob = await getUploadBlob(uri);
    const snapshot = await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(snapshot.ref);
    return url;

}

export const updateCarrerInfo = async (userId:string , data: { uri?: string; profile: string}, succesCallback: (data: {profile: string; cvUrl?: string})=> void) =>{
    let cvUrl = null;
    if(data.uri){
        const storage = getStorage(firebaseApp);
        const storageRef = ref(storage, `resumes/${userId}`);
        const blob = await getUploadBlob(data.uri);
        const snapshot  = await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(snapshot.ref);
        const status =  await updateProfileInfo(userId, { careerProfile: { profile: data.profile, cvUrl: url}})
        succesCallback({ profile: data.profile, cvUrl: url})
    }
    else {
        await updateProfileInfo(userId, { careerProfile: {profile: data.profile}});
        succesCallback({ profile: data.profile});
    }
}


