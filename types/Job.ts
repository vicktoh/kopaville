import { Timestamp } from "firebase/firestore";
export interface Job {
    id?: string;
    creatorId: string;
    title: string;
    description: string;
    location: string;
    organisation: string;
    criteria: string[];
    link?: string;
    dateAdded?: Timestamp;
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
    dateAdded?: Timestamp;
    verified?: boolean;
    bannerUrl?: string;
    creatorId: string;

}