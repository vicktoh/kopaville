
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Device from 'expo-device';
import {db} from "./firebase"
import { ref, set } from "firebase/database";
export async function registerForPushNotificationsAsync(userId: string) {
   let token;
   
   if (Platform.OS === 'android') {
     await Notifications.setNotificationChannelAsync('default', {
       name: 'default',
       importance: Notifications.AndroidImportance.MAX,
       vibrationPattern: [0, 250, 250, 250],
       lightColor: '#FF231F7C',
     });
   }
 
   if (Device.isDevice) {
     const { status: existingStatus } = await Notifications.getPermissionsAsync();
     let finalStatus = existingStatus;
     if (existingStatus !== 'granted') {
       const { status } = await Notifications.requestPermissionsAsync();
       finalStatus = status;
     }
     if (finalStatus !== 'granted') {
      //  alert('Failed to get push token for push notification!');
       return;
     }
     token = (await Notifications.getExpoPushTokenAsync()).data;
     console.log(token);
     const tokensRef = ref(db, `tokens/${userId}`);
     await set(tokensRef, token)
   } else {
   //   alert('Must use physical device for push notifications');
   }
}