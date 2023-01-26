import { sub } from "date-fns";
import firebase from "firebase";
import { DatingFilter } from "../components/DatingFilterForm";
import { Profile } from "../types/Profile";
import { firebaseApp } from "./firebase";





export const fetchDatingProfiles = async (gender: string, location?: string) =>{
    const db = firebase.firestore(firebaseApp);
    let query =  db.collection('users').where('datingProfile.status', '==', 'single').where('loginInfo.gender', '!=', gender);
    if(location) query = query.where('profile.servingState', '==', location);
    const snapshot =  await  query.get();

    const data: Profile[] = [];
    snapshot.forEach((snap)=>{
        const profile = snap.data() as Profile;
        data.push(profile);
    });
    return data;
}

export const convertFilterToAlgolier = (datingFilter: DatingFilter) => 
     Object.entries(datingFilter).filter(([key, value]) => !!value).map(([key, value]) => (datingFilterLabel(key as keyof DatingFilter, value))).join(" AND ");


const datingFilterLabel = (key: keyof DatingFilter, value: string | number | boolean) => {
    switch (key) {
        case "maxAge":
            const yearTimestamp = sub(new Date(), {years: Number(value)}).getTime();
            return `profile.dateOfBirthTimestamp > ${yearTimestamp}`
            break;
        case "minAge":
            const minAgeTimestamp = sub(new Date(), {years: Number(value)}).getTime();
            return `profile.dateOfBirthTimestamp < ${minAgeTimestamp}`
            break;
        case "drinking":
            return value ?  `datingProfile.drinking:true` : ''
        case "smoking":
            return value ? `datingProfile.smoking:true`: ''
        case "kids":
            return value ? `datingProfile.kids:true`: ''
        case "pets":
            return value ? `datingProfile.pets:true` : ''
        case "gender":
            return  value ? `loginInfo.gender:${value}` : ''
        case "genotype":
            return  value ? `datingProfile.genotype:${value}` : ''
    
        default:
            break;
    }
}