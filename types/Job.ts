import firebase from "firebase";
export interface Job {
    id?: string;
    creatorId: string;
    title: string;
    description: string;
    location: string;
    organisation: string;
    criteria: string[];
    link: string;
    dateAdded?: firebase.firestore.Timestamp;
    verified?: boolean
    bannerUrl?: string;
}


export interface Business {
    id?: string;
    name: string;
    address: string;
    instagram?: string;
    twitter?: string;
    link?: string;
    services?: string [];
    dateAdded?: firebase.firestore.Timestamp;
    verified?: boolean;
    bannerUrl?: string;
    creatorId: string;

}