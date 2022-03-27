import { firebaseApp } from './firebase';
import firebase from 'firebase';
import { Profile } from '../types/Profile';
import { SnapshotViewIOSBase } from 'react-native';

export const listenOnProfile = (
    userId: string,
    onSuccessCallback:(data: any) => void
) => {
    const db = firebase.firestore(firebaseApp);
    // const snapshot =  await db.doc(`users/${userId}`).get();
    return db.doc(`users/${userId}`).onSnapshot((snapshot)=> {
        if(snapshot.exists){
            onSuccessCallback(snapshot.data())
        }
    })
    
};





export const fetchUserProfile = async (userId: string) =>{
    const userSnapshot = await firebase.firestore().doc(`users/${userId}`).get();
    if(userSnapshot.exists){
        return userSnapshot.data();
    }
    return null;
}


export const updateProfileInfo = async (userId:string, profile: Partial<Profile>)=>{
    const db = firebase.firestore(firebaseApp);
    const userRef = db.doc(`users/${userId}`);
    try {
        await userRef.update(profile);
        return { status: 'success'}
    } catch (error) {
        if (error){
            return {status: 'failed', message: "error occured"}

        }

        return { status: 'failed', message: 'unexpected error'}
    }
}

export const getUploadBlob = async (uri: string) => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            // console.log(xhr);
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.log(e)
            reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
    });
    return blob as Blob;
}


export const uploadProfilePicture = async (userId: string, uri: string)=>{
    const storage = firebase.storage(firebaseApp);
    const storageRef = storage.ref(`profile_pics/${userId}`);
    const blob = await getUploadBlob(uri);
    const snapshot = await storageRef.put(blob);
    const url = await snapshot.ref.getDownloadURL();
    return url;

}

export const uploadFileToFirestore = async (path: string, uri: string) =>{
    const storage = firebase.storage(firebaseApp);
    const storageRef = storage.ref(path);
    const blob = await getUploadBlob(uri);
    try {
    const snapshot = await  storageRef.put(blob);
        const url = await snapshot.ref.getDownloadURL();
        return {
            url, status: 'success'};
    } catch (error) {
        if (error){
            return {status: 'failed', message: error}

        }

        return { status: 'failed', message: 'unexpected error'}
    }
    
}

export const updateCareerInfo = async (userId:string , data: { uri?: string; profile: string}, succesCallback: (data: {profile: string; cvUrl?: string})=> void) =>{
    let cvUrl = null;
    if(data.uri){
        const storage = firebase.storage(firebaseApp);
        const storageRef = storage.ref(`resumes/${userId}`);
        const blob = await getUploadBlob(data.uri);
        const snapshot  = await storageRef.put(blob);
        const url = await snapshot.ref.getDownloadURL();
        const status =  await updateProfileInfo(userId, { careerProfile: { profile: data.profile, cvUrl: url}})
        succesCallback({ profile: data.profile, cvUrl: url})
    }
    else {
        await updateProfileInfo(userId, { careerProfile: {profile: data.profile}});
        succesCallback({ profile: data.profile});
    }
}


