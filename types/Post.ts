import { Timestamp } from "@firebase/firestore";

export interface Post {
    dateCreated: Timestamp;
    creatorId: string;
    likes: number;
    comments: number;
}

export interface ImagePost extends Post {
    imageUrl: string;
    caption?: string;
}

export interface TextPost extends Post {
    text: string;
}