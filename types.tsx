/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Profile } from './types/Profile';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
};
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Forgot: undefined;
};
export type AppStackParamList = {
  Home: undefined;
  Jobs: undefined;
  MarketPlace: undefined;
  Dating: undefined
};

export type ProfileStackParamList = {
  Main: undefined;
  Edit: undefined;
}

export type DrawerParamList = {
  Posts: undefined;
  "Dating Profile": {profile?: Profile};
  "Career Profile": {profile?: Profile};
  Profile: {profile?: Profile};
  Bookstore: undefined;
  Historyville: undefined
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
