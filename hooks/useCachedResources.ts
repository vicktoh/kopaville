import { FontAwesome } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { LOCAL_SYSTEM_INFO } from '../constants/Storage';
import { getLocalData, getLocalUserData } from '../services/local';
import { System } from '../types/System';
import { User } from '../types/User';
export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [auth, setAuth] = useState<User| null>(null);
  const [isOnBoarded, setIsOnboarded] = useState<boolean>(false);
  const [systemInfo, setSystemInfo ] = useState<System | null>(null);
  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          'Poppins Regular': require('../assets/fonts/Poppins-Regular.ttf'),
          'Poppins Medium': require('../assets/fonts/Poppins-Medium.ttf'),
          'Poppins Light': require('../assets/fonts/Poppins-Light.ttf'),
          'Poppins SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
          'Poppins Bold': require('../assets/fonts/Poppins-Bold.ttf'),

        });
        // Load images
        await Asset.fromModule(require('../assets/images/datingcover1.jpg')).downloadAsync();
        const user: User = await getLocalUserData();
        user && setAuth(user);
        const info = await getLocalData(LOCAL_SYSTEM_INFO)
        if(info) {
          setSystemInfo(info);
           setIsOnboarded(true);

        }
      
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return {isLoadingComplete, auth, setAuth, isOnBoarded, systemInfo, setIsOnboarded};
}
