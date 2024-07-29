import { firebaseApp, firestore } from './firebase';
import { Job, Business } from '../types/Job';
import { getUploadBlob, uploadFileToFirestore } from './profileServices';
import { addDoc, collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';



export const listenOnJobs = async ( callback: (data: any)=> void, filter: {location?: string, type?: 'job' | 'service'} ) =>{
    const jobsCollection =  collection(firestore, 'jobs')
    let q = query(jobsCollection, orderBy('dateAdded', 'desc'));
    if(filter?.location) q =  query(q, where('location', '==', filter?.location));
    if(filter?.type)  q =  query(q, orderBy(filter.type === "job" ? 'title': 'name'), limit(5));
    return onSnapshot(q, (snapshot) => {
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
    
    const newJobRef = doc(collection(firestore,'jobs'));
    if(bannerUri){
        const banner =  await uploadFileToFirestore(`jobBanners/${newJobRef.id}`, bannerUri);
        jobPost.bannerUrl = banner.url;
    }
    const jobToAdd: Partial<Job> = { ...jobPost, dateAdded: Timestamp.now()}
    
    await setDoc(newJobRef, jobToAdd);
}
export const editJob = async (job: Job, bannerUri?: string): Promise<string> => {
    const jobRef = doc(firestore, `jobs/${job.id}`);
    
    if(bannerUri) {
        const banner = await uploadFileToFirestore(`jobBanners/${jobRef.id}`, bannerUri);
        job.bannerUrl = banner.url;
    }
    await updateDoc(jobRef, job as any);
    return jobRef.id;
}

export const postService = async( service: Partial<Business>, bannerUri?: string) =>{
    const serviceRef = doc(collection(firestore,'jobs'));
    if(bannerUri){
        const banner =  await uploadFileToFirestore(`jobBanners/${serviceRef.id}`, bannerUri);
        service.bannerUrl = banner.url;
    }
    const serviceToAdd: Partial<Job> = { ...service, dateAdded: Timestamp.now()}
    await setDoc(serviceRef, serviceToAdd);
}

export const editService = async (service: Business, bannerUri?: string): Promise<string> => {
    const serviceRef = doc(firestore, `jobs/${service.id}`);
    if(bannerUri) { 
        const banner = await uploadFileToFirestore(`jobBanners/${serviceRef.id}`, bannerUri);
        service.bannerUrl = banner.url;
    }
    await updateDoc(serviceRef, service as any);
    return serviceRef.id;
}

export const removeJob = async (jobId: string) => {
    const serviceRef = doc(firestore, `jobs/${jobId}`);
    return deleteDoc(serviceRef);
}