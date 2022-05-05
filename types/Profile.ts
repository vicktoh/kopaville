export interface Education {
    institution: string; qualification: string; period: {start: string, end: string}
}

export interface Business {
    name: string;
    instagram?: string;
    twitter?: string;
    link?: string;
    description?: string;
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
        servingLGA?: string;
        bloodGroup?: string;
        genotype?: string;
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
        alias?: string;
        coverUrl?: string;
        covers?: string[];
        profile?: string;
        interest?: string [];
        status?: string;
        bloodGroup?: string;
        genotype?: string;
        showBloodGroup?: boolean

    };
    followerships?: {
        following: number;
        followers: number;
    }
}




