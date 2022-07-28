export interface Education {
    institution: string; qualification: string; period: {start: string, end: string}
}

export enum CorperStatus  {
    "Ex-Corper" = "Ex-Corper",
    "Serving Corper" = "Serving Corper",
    "Prospective Corper" = "Prospective Corper",
}
export interface Business {
    name: string;
    instagram?: string;
    twitter?: string;
    link?: string;
    description?: string;
}

export enum Gender {
    "male"="male",
    "female"="female",
    "others"="others"
}

export interface Profile {
    loginInfo : {
        email: string;
        fullname: string;
        type: string;
        username: string;
        gender?: Gender;
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
        height?: string;
        phoneNumber?: string;
        displayPhoneNumber?: boolean;
        languages?: string[];
        shoeSize?: string;
        kids?: boolean;
        numberOfKids?: boolean;
        corperStatus?: CorperStatus,
        tribe?: string
        platoon?: string;
        saedCourse?: string;
        camp?: string;
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
        currentCity?:string;
        alias?: string;
        smoking?: boolean;
        kids?: boolean;
        noOfKids?: string;
        pets?: boolean;
        drinking?: boolean;
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
    verified?: boolean;
}

export type Block = {
    blocked: string[];
    blockedBy: string[];
}




