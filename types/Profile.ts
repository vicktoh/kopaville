export interface Education {
    institution: string; qualification: string; period: {start: string, end: string}
}

export interface Business {
    name: string;
    instagram?: string;
    twitter?: string;
    link?: string;
}

export interface Profile {
    loginInfo : {
        email: string;
        fullname: string;
        type: string;
        username: string;
        gender?: string;
    },
    userId: string;
    profileUrl: string;
    profile?: {
        bio: string;
        dateOfBirth: {
            year: string;
            month: string;
            day: string;
        };
        displayAge?: boolean;
        servingState: string;
        lga?: string;
        ppa?: string;
        stateOfOrigin: string;
        instagram?: string;
        twitter?: string;
    };
    careerProfile?: {
        profile?: string;
        cvUrl?: string;
        links ?: {label: string; url: string}[];
        education?: Education[];
        business?: Business[];

    };
    datingProfile?:{
        coverUrl?: string;
        profile?: string;
        interest?: string [];
        status?: string;
    };
    followerships?: {
        following: number;
        followers: number;
    }
}




