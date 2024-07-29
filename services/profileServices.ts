import { firebaseApp, firestore, storage } from './firebase';
import { Profile } from '../types/Profile';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const listenOnProfile = (
    userId: string,
    onSuccessCallback:(data: any) => void
) => {
    // const snapshot =  await db.doc(`users/${userId}`).get();
    return onSnapshot(doc(firestore, `users/${userId}`),(snapshot)=> {
        console.log(userId, "🍏")
        if(snapshot.exists()){
            onSuccessCallback(snapshot.data())
        }
    }, (err) => {
        console.log(err, "🌹")
    })
    
};





export const fetchUserProfile = async (userId: string) =>{
    const userSnapshot = await getDoc(doc(firestore, `users/${userId}`));
    if(userSnapshot.exists()){
        return userSnapshot.data();
    }
    return null;
}


export const updateProfileInfo = async (userId:string, profile: Partial<Profile>)=>{
    const userRef = doc(firestore, `users/${userId}`);
    try {
        await updateDoc(userRef, profile);
        return { status: 'success'}
    } catch (error) {
        if (error){
            return {status: 'failed', message: "error occured"}

        }

        return { status: 'failed', message: 'unexpected error'}
    }
}
export const chekIfVerified = async(userId: string) =>{
    const verifiedSnap = await getDoc(doc(firestore, `verifiedUser/${userId}`));
    return verifiedSnap.exists()
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
    const storageRef = ref(storage, `profile_pics/${userId}`);
    const blob = await getUploadBlob(uri);
    const snapshot = await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(snapshot.ref);
    return url;

}

export const uploadFileToFirestore = async (path: string, uri: string) =>{
    const storageRef = ref(storage, path);
    const blob = await getUploadBlob(uri);
    try {
    const snapshot = await  uploadBytes(storageRef, blob);
        const url = await getDownloadURL(snapshot.ref);
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


