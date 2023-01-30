import firebase from "firebase";
export interface Post {
    dateCreated: number;
    mediaType: 'Video'| 'Image' | 'None',
    creatorId: string;
    likes: number;
    comments: number;
    imageUrl?: string [];
    videoUrl?: string;
    caption?: string;
    postId?: string;
    text?: string;
    avartar: {
        photoUrl?: string;
        username: string;
    }

}

export interface FirebasePost extends Omit<Post, "dateCreated">{
    dateCreated: firebase.firestore.Timestamp
}



