/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Recipient } from './types/Conversation';
import {  Job, Business as JobBusiness } from './types/Job';
import { Post } from './types/Post';
import { Product } from './types/Product';
import { Profile, Business } from './types/Profile';

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
  "Kopa Market": undefined;
  Dating: undefined;
  Message: undefined;
};

export type ProfileStackParamList = {
  Main: undefined;
  Edit: undefined;
}
export type CareerStackParamList = {
  Main: undefined;
  Bussiness: {
    mode: 'add' | 'edit';
    business?: Business;
    index?: number
  };
}

export type JobStackParamList = {
  Main: undefined;
  "Add Job": undefined;
  "Add Business": undefined;
  "Job Details": {job: Job & JobBusiness}
}

export type MarketStackParamList = {
  Market: undefined;
  "Product Detail": {product: Product};
  "Cart": undefined;
  "Billing": undefined;
  "Orders": undefined;
}

export type MessageStackParamList = {
  MessageList: undefined;
  MessageBubble: {conversationId?: string, recipient: Recipient};
}
export type DatingStackParamList = {
  Main: undefined;
  "Profile": {profile: Profile};
}
export type UserDatingStackParamList = {
  "My Dating Profile": undefined;
  "Edit Dating Profile": {profile: Profile};
}

export type DrawerParamList = {
  Posts: undefined;
  "Dating Profile": {profile?: Profile};
  "Career Profile": {profile?: Profile};
  "General Profile": {profile?: Profile};
  Historyville: undefined
  Info: undefined
}

export type HomeStackParamList = {
  Home: undefined;
  "Explore Post": undefined;
  "Explore Users": undefined;
  ProfilePreview: { profile?: Profile, userId?:string, fetch?: boolean};
  CareerPreview: { profile?: Profile, userId?:string, fetch?: boolean};
  DatingPreview: { profile: Profile, userId?: string, fetch?: boolean};
  Comments: { postId: string, postText: string; postUsername: string};
  Report: { post?: Post, user?: Profile };

  
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
