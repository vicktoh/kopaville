import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerParamList } from '../types';
import { DrawerContent } from '../components/DrawerContent';
import { ProfileNavigation } from './ProfileNavigation';
import { HomeStackNavigation } from './HomeStackNavigation';
import { UserDatingNavigation } from './UserDatingNavigation';
import { CareerNavigation } from './CareerNavigation';
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
            <Drawer.Screen name="Posts" component={HomeStackNavigation} options={{ headerShown: false }} />
            <Drawer.Screen name="General Profile" component={ProfileNavigation} options={{ headerShown: false }} />
            <Drawer.Screen name="Dating Profile" component={UserDatingNavigation} options={{ headerShown: false }} />
            <Drawer.Screen name="Career Profile" component={CareerNavigation} options={{ headerShown: false }} />
            {/* <Drawer.Screen name="Historyville" component={TabTwoScreen} /> */}
        </Drawer.Navigator>
    );
};
