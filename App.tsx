import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { theme } from './theme';
import { NativeBaseProvider } from 'native-base';
import { AppLoading } from './screens/AppLoading';
import { Provider } from 'react-redux';
import { store, persistor } from './reducers/store';
import { OnboardingScreen } from './screens/OnboardingScreen';
import {LogBox} from 'react-native';
import { initializeApp } from './services/authServices';
import { PersistGate } from 'redux-persist/integration/react'

LogBox.ignoreLogs(['NativeBase:']);
export default function App() {
    const { isLoadingComplete, auth, systemInfo, isOnBoarded, setIsOnboarded } = useCachedResources();
    const colorScheme = useColorScheme();
    if(auth){
      store.dispatch({ type: 'auth', payload: auth})
    }
    if(!isLoadingComplete && !auth){
        initializeApp(auth);
    }
    if (!isLoadingComplete) {
        return <AppLoading />;
    }
    if (isOnBoarded) {
        return (
          
            <NativeBaseProvider theme={theme} config = {{strictMode: 'off'}}>
                <Provider store={store}>
                    <PersistGate persistor={persistor} loading = {<AppLoading />}>
                    <SafeAreaProvider style={{flex: 1}}>
                        <Navigation colorScheme={colorScheme} localAuth={ auth } localSystemInfo = {systemInfo}  />
                        <StatusBar />
                    </SafeAreaProvider>
                    </PersistGate>
                </Provider>
            </NativeBaseProvider>
        );
    }

    return (
        <NativeBaseProvider theme={theme}>
            <OnboardingScreen systemInfo={systemInfo} setIsOnboarded={setIsOnboarded} auth={auth} />
        </NativeBaseProvider>
    );
}
