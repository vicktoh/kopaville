/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Recipient } from './types/Conversation';
import { Business, Job } from './types/Job';
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
  Dating: undefined;
  Message: undefined;
};

export type ProfileStackParamList = {
  Main: undefined;
  Edit: undefined;
}

export type JobStackParamList = {
  Main: undefined;
  "Add Job": undefined;
  "Add Business": undefined;
  "Job Details": {job: Job & Business}
}

export type MessageStackParamList = {
  MessageList: undefined;
  MessageBubble: {conversationId?: string, recipient: Recipient};
}
export type DatingStackParamList = {
  Main: undefined;
  "Profile": {profile: Profile};
}

export type DrawerParamList = {
  Posts: undefined;
  "Dating Profile": {profile?: Profile};
  "Career Profile": {profile?: Profile};
  "General Profile": {profile?: Profile};
  Historyville: undefined
}

export type HomeStackParamList = {
  Home: undefined;
  "Explore Post": undefined;
  "Explore Users": undefined;
  ProfilePreview: { profile?: Profile, userId?:string, fetch?: boolean};
  CareerPreview: { profile?: Profile, userId?:string, fetch?: boolean};
  DatingPreview: { profile: Profile, userId?: string, fetch?: boolean};
  Comments: { postId: string, postText: string; postUsername: string}
  
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
