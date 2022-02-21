import { createDrawerNavigator } from '@react-navigation/drawer';
import TabTwoScreen from '../screens/TabTwoScreen';
import { DrawerParamList } from '../types';
import { DrawerContent } from '../components/DrawerContent';
import { HomepageScreen } from '../screens/HomepageScreen';
const Drawer = createDrawerNavigator<DrawerParamList>();

export const HomeDrawerNavigation = () => {
    return (
        <Drawer.Navigator initialRouteName='Posts' drawerContent={DrawerContent} screenOptions={{headerBackgroundContainerStyle: {backgroundColor: 'white', borderWidth: 0 }, drawerLabel : ""}} >
            <Drawer.Screen name="Posts" component={HomepageScreen} options={{ headerTitle : ""}} />
            <Drawer.Screen name="Profile" component={TabTwoScreen} />
            <Drawer.Screen name="Dating Profile" component={TabTwoScreen} />
            <Drawer.Screen name="Career Profile" component={TabTwoScreen} />
            <Drawer.Screen name="Bookstore" component={TabTwoScreen} />
            <Drawer.Screen name="Historyville" component={TabTwoScreen} />
        </Drawer.Navigator>
    );
};
