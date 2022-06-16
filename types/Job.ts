import firebase from "firebase";
export interface Job {
    title: string;
    description: string;
    location: string;
    organisation: string;
    criteria: string[];
    link: string;
    dateAdded?: firebase.firestore.Timestamp;
    verified?: boolean

}


export interface Business {
    name: string;
    address: string;
    instagram?: string;
    twitter?: string;
    link?: string;
    services?: string [];
    dateAdded?: firebase.firestore.Timestamp;
    verified?: boolean

}