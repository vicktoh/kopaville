import { sub } from "date-fns";
import { DatingFilter } from "../components/DatingFilterForm";
import { Profile } from "../types/Profile";
import { firebaseApp, firestore } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";





export const fetchDatingProfiles = async (gender: string, location?: string) =>{
    
    // let query =  db.collection('users').where('datingProfile.status', '==', 'single').where('loginInfo.gender', '!=', gender);
    const userCollection = collection(firestore,'users')
    let q =  query(userCollection, where('datingProfile.status', '==', 'single'), where('loginInfo.gender', '!=', gender), );
    
    const snapshot =  await  getDocs(q)

    const data: Profile[] = [];
    snapshot.forEach((snap)=>{
        const profile = snap.data() as Profile;
        data.push(profile);
    });
    return data;
}

export const convertFilterToAlgolier = (datingFilter: DatingFilter) => 
     Object.entries(datingFilter).filter(([key, value]) => !!value && !["minAge", "maxAge"].includes(key)).map(([key, value]) => (datingFilterLabel(key as keyof DatingFilter, value))).join(" AND ");


const datingFilterLabel = (key: keyof DatingFilter, value: string | number | boolean) => {
    switch (key) {
        case "maxAge":
            const yearTimestamp = sub(new Date(), {years: Number(value)}).getTime();
            // return `profile.dateOfBirthTimestamp > ${yearTimestamp}`
            return ''
            break;
        case "minAge":
            const minAgeTimestamp = sub(new Date(), {years: Number(value)}).getTime();
            return ''
            // return `profile.dateOfBirthTimestamp < ${minAgeTimestamp}`
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