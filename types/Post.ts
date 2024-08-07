import { Timestamp } from "firebase/firestore";
export interface Post {
    dateCreated: number;
    mediaType: 'Video'| 'Image' | 'None',
    creatorId: string;
    likes: number;
    comments: number;
    imageUrl?: { storageKey: string, url: string} [];
    videoUrl?: string;
    caption?: string;
    postId?: string;
    text?: string;
    avartar: {
        photoUrl?: string;
        username: string;
    }

}
export interface FirebasePost  {
    dateCreated: Timestamp,
    mediaType: 'Video'| 'Image' | 'None',
    creatorId: string;
    likes: number;
    comments: number;
    imageUrl?: { storageKey: string, url: string} [];
    videoUrl?: string;
    caption?: string;
    postId?: string;
    text?: string;
    avartar: {
        photoUrl?: string;
        username: string;
    }
}
export type PostWithId = Post & { id: string};
export interface FirebasePost extends Omit<Post, "dateCreated">{
    dateCreated: Timestamp
}



