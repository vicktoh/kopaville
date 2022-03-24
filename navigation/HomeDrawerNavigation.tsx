import { createDrawerNavigator } from '@react-navigation/drawer';
import TabTwoScreen from '../screens/TabTwoScreen';
import { DrawerParamList } from '../types';
import { DrawerContent } from '../components/DrawerContent';
import { CareerScreen } from '../screens/CareerScreen';
import { ProfileNavigation } from './ProfileNavigation';
import { DatingScreen } from '../screens/DatingScreen';
import { HomeStackNavigation } from './HomeStackNavigation';
const Drawer = createDrawerNavigator<DrawerParamList>();

export const HomeDrawerNavigation = () => {
    return (
        <Drawer.Navigator
            initialRouteName="Posts"
            drawerContent={DrawerContent}
            screenOptions={{
                headerBackgroundContainerStyle: { backgroundColor: 'white', borderWidth: 0 },
                drawerLabel: '',
                headerStyle: { backgroundColor: 'white' },
            }}
        >
            <Drawer.Screen name="Posts" component={HomeStackNavigation} options={{ headerTitle: 'Timeline' }} />
            <Drawer.Screen name="Profile" component={ProfileNavigation} options={{ headerShown: false }} />
            <Drawer.Screen name="Dating Profile" component={DatingScreen} options={{ headerShown: false }} />
            <Drawer.Screen name="Career Profile" component={CareerScreen} options={{ headerShown: false }} />
            <Drawer.Screen name="Bookstore" component={TabTwoScreen} />
            <Drawer.Screen name="Historyville" component={TabTwoScreen} />
        </Drawer.Navigator>
    );
};
