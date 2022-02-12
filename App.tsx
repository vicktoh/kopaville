import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { theme } from './theme';
import { NativeBaseProvider } from 'native-base';
import { AppLoading } from './screens/AppLoading';
import { Provider } from 'react-redux';
import { store } from './reducers/store';
import { OnboardingScreen } from './screens/OnboardingScreen';
export default function App() {
    const { isLoadingComplete, auth, systemInfo, isOnBoarded, setIsOnboarded } = useCachedResources();
    const colorScheme = useColorScheme();

    if (!isLoadingComplete) {
        return <AppLoading />;
    }
    if (isOnBoarded) {
        return (
            <NativeBaseProvider theme={theme}>
                <Provider store={store}>
                    <SafeAreaProvider>
                        <Navigation colorScheme={colorScheme} />
                        <StatusBar />
                    </SafeAreaProvider>
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
