import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCAL_USER_INFO } from "../constants/Storage";
export const  getLocalUserData = async ()=>{
    try {
        const userData = await AsyncStorage.getItem(LOCAL_USER_INFO);
    return userData ?  JSON.parse(userData) : userData;
    } catch (error) {
        console.log(error);
    }
    
}

export const getLocalData = async(key: string) => {
    try {
        const userData = await AsyncStorage.getItem(key);
    return userData ?  JSON.parse(userData) : userData;
    } catch (error) {
        console.log(error);
    }
}

export const setLocalData = async( key:string, data: string) =>{
    try {
        await AsyncStorage.setItem(key, data);
        return true
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const removeLocalData = async(key: string) =>{
    try {
        await AsyncStorage.removeItem(key);
        return true
    } catch (error) {
        return false
        
    }
}
