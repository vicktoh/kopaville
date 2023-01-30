import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';
import * as Notifications from 'expo-notifications';
// import { Notifications } from 'expo';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setAuth } from '../reducers/authSlice';
import { StoreType } from '../reducers/store';

import { User } from '../types/User';
import { AppNavigationStack } from './AppNavigation';
import { AuthNavigation } from './AuthNavigation';
import LinkingConfiguration from './LinkingConfiguration';
import { System } from '../types/System';
import { setSystemInfo } from '../reducers/systemSlice';
import {
    listenOnChats,
    listenOnFollowers,
    listenonFollowing,
    listenOnlikes,
    listenOnTimeline,
} from '../services/postsServices';
import { setFollowership } from '../reducers/followershipSlice';
import { setPosts } from '../reducers/postSlice';
import { listenOnProfile } from '../services/profileServices';
import { setProfile } from '../reducers/profileSlice';
import { setLike } from '../reducers/likesSlice';
import { setChats } from '../reducers/chatSlice';
import { listenOnCategories } from '../services/productServices';
import { setCategories } from '../reducers/categoriesSlice';
import { Profile } from '../types/Profile';
import { checkListFromProfile } from '../services/helpers';
import { listenOnBlocks } from '../services/authServices';
import { setBlock } from '../reducers/blockSlice';
import { registerForPushNotificationsAsync } from '../services/notification';
Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
export default function Navigation({
    colorScheme,
    localAuth,
    localSystemInfo,
}: {
    colorScheme: ColorSchemeName;
    localAuth: User | null;
    localSystemInfo: System | null;
}) {
    const { auth, systemInfo, followerships, block } =
        useAppSelector<StoreType>((store) => store);
    const dispatch = useAppDispatch();
    const notificationListener = React.useRef<any>();
  const responseListener = React.useRef<any>();
    React.useEffect(() => {
        if (localAuth && !auth) {
            dispatch(setAuth(localAuth));
        }
        if (localSystemInfo && !systemInfo) {
            dispatch(setSystemInfo(localSystemInfo));
        }
    }, [localAuth, localSystemInfo, followerships]);

    // React.useEffect(() => {
    //     if (auth) {
    //         try {
    //             const unsubscribe = listenOnFollowers(auth.userId, (data) =>
    //                 dispatch(
    //                     setFollowership({
    //                         ...(followerships || {}),
    //                         followers: data,
    //                     })
    //                 )
    //             );
    //             return unsubscribe;
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    // }, [auth]);

    React.useEffect(() => {
        if (auth) {
            try {
                const unsubscribe = listenonFollowing(auth.userId, (data) =>
                    dispatch(
                        setFollowership({ ...followerships, following: data })
                    )
                );
                return unsubscribe;
            } catch (error) {
                console.log(error);
            }
        }
    }, [auth]);
    React.useEffect(() => {
        if (auth) {
            try {
                const unsubscribe = listenOnFollowers(auth.userId, (data) => {
                    // console.log({ data }, "from follower");
                    dispatch(
                        setFollowership({ ...followerships, followers: data })
                    );
                });
                return unsubscribe;
            } catch (error) {
                console.log(error);
            }
        }
    }, [auth]);

    React.useEffect(() => {
        if (auth && followerships?.following) {
            try {
                const unsubscribe = listenOnTimeline(
                    [
                        ...(followerships?.following || []).map(
                            ({ userId }) => userId
                        ),
                        auth.userId,
                    ],
                    (data) => dispatch(setPosts(data)),
                    (e) => console.log(e),
                    block?.blocked || []
                );
                return unsubscribe;
            } catch (error) {
                setPosts('error');
                console.log(error);
            }
        }
    }, [followerships?.following, auth, block]);

    React.useEffect(() => {
        if (auth) {
            try {
                const unsubscribe = listenOnProfile(
                    auth.userId,
                    (data: Profile) => {
                        dispatch(setProfile(data));
                        const systemInfo: System = {
                            dateOnboarded: new Date().getTime(),
                            checkList: checkListFromProfile(data),
                        };
                        dispatch(setSystemInfo(systemInfo));
                    }
                );

                return () => unsubscribe();
            } catch (error) {
                console.log(error);
            }
        }
    }, [auth]);

    React.useEffect(() => {
        if (auth) {
            try {
                const unsubscribe = listenOnlikes(auth.userId, (data) => {
                    dispatch(setLike(data));
                });
                return () => unsubscribe();
            } catch (error) {
                console.log(error);
            }
        }
    }, [auth]);
    React.useEffect(() => {
        if (auth) {
            try {
                const unsubscribe = listenOnChats(auth.userId, (data) => {
                    dispatch(setChats(data));
                });
                return () => unsubscribe();
            } catch (error) {
                console.log(error);
            }
        }
    }, [auth]);
    React.useEffect(() => {
        if (auth) {
            try {
                const unsubscribe = listenOnBlocks(auth.userId, (data) => {
                    dispatch(setBlock(data));
                });
                return () => unsubscribe();
            } catch (error) {
                console.log(error);
            }
        }
    }, [auth]);
    React.useEffect(() => {
        if (auth) {
            try {
                const unsubscribe = listenOnCategories((data) => {
                    dispatch(setCategories(data));
                });
                return () => unsubscribe();
            } catch (error) {
                console.log(error);
            }
        }
    }, []);
    React.useEffect(()=> {
        if(auth){
            registerForPushNotificationsAsync(auth.userId);
            notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                console.log(notification)
              });
          
              responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                console.log(response);
              });
          
              return () => {
                Notifications.removeNotificationSubscription(notificationListener.current);
                Notifications.removeNotificationSubscription(responseListener.current);
              };

        }
    }, [auth])
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
            {auth ? <AppNavigationStack /> : <AuthNavigation />}
        </NavigationContainer>
    );
}
