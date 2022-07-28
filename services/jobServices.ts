import { firebaseApp } from './firebase';
import firebase from 'firebase';
import { Job, Business } from '../types/Job';
import { getUploadBlob, uploadFileToFirestore } from './profileServices';



export const listenOnJobs = async ( callback: (data: any)=> void, filter: {location?: string, type?: 'job' | 'service'} ) =>{
    const db = firebase.firestore(firebaseApp);
    let query = db.collection('jobs').orderBy('dateAdded', 'desc');
    if(filter?.location) query =  query.where('location', '==', filter?.location);
    if(filter?.type)  query = filter.type === "job" ? query.orderBy('title') : query.orderBy('name') ;
    return query.limit(50).onSnapshot((snapshot) => {
        const data: any = [];
        snapshot.forEach((snap)=>{
            const job = snap.data();
            job.id = snap.id;
            data.push(job);
        });
        callback(data);
    })
}



export const postJob = async (jobPost: Partial<Job>, bannerUri?: string) =>{
    
    const db = firebase.firestore(firebaseApp);
    const newJobRef = db.collection('jobs').doc();
    if(bannerUri){
        const banner =  await uploadFileToFirestore(`jobBanners/${newJobRef.id}`, bannerUri);
        jobPost.bannerUrl = banner.url;
    }
    const jobToAdd: Partial<Job> = { ...jobPost, dateAdded: firebase.firestore.Timestamp.now()}
    
    await newJobRef.set(jobToAdd);
}

export const postService = async( service: Partial<Business>, bannerUri?: string) =>{
    const db = firebase.firestore(firebaseApp);
    const serviceRef = db.collection('jobs').doc();
    if(bannerUri){
        const banner =  await uploadFileToFirestore(`jobBanners/${serviceRef.id}`, bannerUri);
        service.bannerUrl = banner.url;
    }
    const serviceToAdd: Partial<Job> = { ...service, dateAdded: firebase.firestore.Timestamp.now()}
    await serviceRef.set(serviceToAdd);
}

export const removeJob = async (jobId: string) => {
    const db = firebase.firestore(firebaseApp);
    const serviceRef = db.doc(`jobs/${jobId}`);
    return serviceRef.delete();
}