import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types';

import { HomepageScreen } from '../screens/HomepageScreen';
import { ExplorePostScreen } from '../screens/ExplorePostScreen';
import { ExploreUsersScreen } from '../screens/ExploreUsersScreen';
import { CommentsScreen } from '../screens/CommentsScreen';
import { HStack, Icon, IconButton } from 'native-base';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { ProfileReviewScreen } from '../screens/ProfileReviewScreen';
import { CareerReviewScreen } from '../screens/CareerReviewScreen';
import { DatingReviewScreen } from '../screens/DatingReviewScreen';
import { ReportPostScreen } from '../screens/ReportPostScreen';
import { NewPost } from '../screens/NewPost';

const HomePageStack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackNavigation = () => {
    return (
        <HomePageStack.Navigator initialRouteName="Home">
            <HomePageStack.Group>
                <HomePageStack.Screen
                    name="Home"
                    component={HomepageScreen}
                    options={({ navigation, route }) => ({
                        headerTitle: 'Timeline',
                        headerStyle: { backgroundColor: 'white'},
                        headerTitleStyle: {color: 'black'},
                        headerLeft: () => (
                            <IconButton
                                size="sm"
                                onPress={() => navigation.toggleDrawer()}
                                icon={<Icon size="sm" color="primary.400" as={Entypo} name="menu" />}
                            />
                        ),
                        headerRight: ()=>(
                            <HStack space = {3}>
                                <IconButton size = "sm" onPress={()=> navigation.navigate("Explore Post")} icon = {<Icon size = "sm" as = {Entypo} name = "compass" color = "secondary.400"/>}/>
                                <IconButton size = "sm" onPress={()=> navigation.navigate("Explore Users")} icon = {<Icon size = "sm" as = {FontAwesome5} name = "users" color = "secondary.400"/>}/>
                            </HStack>
                        )
                    })}
                />
                <HomePageStack.Screen
                    name="Explore Post"
                    component={ExplorePostScreen}
                    options={{ headerTitle: 'Explore', headerStyle: {backgroundColor: 'white'}, headerTitleStyle: {color: 'black'}  }}
                />
                <HomePageStack.Screen
                    name="Explore Users"
                    component={ExploreUsersScreen}
                    options={{ headerTitle: 'Find Friends', headerStyle: {backgroundColor: 'white'}, headerTitleStyle: {color: 'black'}  }}
                />
                <HomePageStack.Screen
                    name="ProfilePreview"
                    component={ProfileReviewScreen}
                    options={{ headerTitle: 'Profile', headerStyle: {backgroundColor: 'white'}, headerTitleStyle: {color: 'black'} }}
                    
                />
                <HomePageStack.Screen
                    name="CareerPreview"
                    component={CareerReviewScreen}
                    options={{ headerShown: false }}
                />
                <HomePageStack.Screen
                    name="DatingPreview"
                    component={DatingReviewScreen}
                    options={{ headerShown: false }}
                />
                <HomePageStack.Screen name="New Post" component={NewPost} options={{headerShown: false}} />
            </HomePageStack.Group>
            <HomePageStack.Group screenOptions={{ presentation: 'modal' }}>
                <HomePageStack.Screen
                    name="Comments"
                    component={CommentsScreen}
                    options={{ headerShown: false }}
                />
                <HomePageStack.Screen name = "Report" component={ReportPostScreen} />

            </HomePageStack.Group>
        </HomePageStack.Navigator>
    );
};
