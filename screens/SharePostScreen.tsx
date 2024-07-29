import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Flex, Icon, IconButton } from 'native-base'
import React, { FC } from 'react'
import { HomeStackParamList } from '../types'
import { AntDesign } from '@expo/vector-icons'
import { Post } from '../types/Post'
import { Follower } from '../services/followershipServices'
import { useAppSelector } from '../hooks/redux'
import { ChatType, Recipient } from '../types/Conversation'
import { conversationExists, sendMessage, startConversationWithMessage } from '../services/messageServices'
import { FollowersList } from '../components/FollowersList'
type SharePostScreenProps = NativeStackScreenProps<HomeStackParamList, "Share">
export const SharePostScreen: FC<SharePostScreenProps> = ({navigation, route}) => {
   const { followerships, block, auth, profile, chats } = useAppSelector(
       ({ followerships, block, auth, profile, chats }) => ({
           followerships,
           profile,
           block,
           auth,
           chats
       })
   );
   const params = route.params || {};
   const { post, userId } = params;
   const sharePost = async (follower: Follower, post: Post | undefined) => {
      const blocked = (block?.blocked || []).filter(
          (userId, i) => userId === follower.userId);
      if (blocked.length) return;
      if (follower.userId === auth?.userId) {
          return;
      }
      const to: Recipient = {
          userId: follower?.userId || '',
          photoUrl: follower.photoUrl || '',
          fullname: follower.fullname || '',
          username: follower.username || '',
      };
      const from: Recipient={
          userId: auth?.userId || "",
          photoUrl: profile?.profileUrl || "",
          fullname: profile?.loginInfo.fullname || "",
          username: profile?.loginInfo.username || ""
      }
      
      const conversationId = conversationExists(follower?.userId || '', chats);
      if(conversationId){
          await sendMessage(conversationId, to, from, `Check checkout this post from ${post?.avartar.username || "this user"}`, ChatType.post, post?.postId ,post?.text || `${post?.avartar.username || ""} post`, undefined, post);
          navigation.goBack();
          // messageNavigation.navigate("Message", {
          //     screen: 'MessageBubble',
          //     params: {
          //         conversationId: conversationId || undefined,
          //         recipient: to,
          //     },
          // });
      } else{
          await startConversationWithMessage(
              from,
              to,
              `Check out this post from ${
                  post?.avartar.username || 'this user'
              }`,
              (conversationid) => {
                  navigation.goBack();
              },
              ChatType.post,
              post?.postId,
              `${post?.avartar.username || 'User'} post`,
              undefined,
              post
          );
      }
      
      // navigation.navigate("MessageBubble", { conversationId : conversationId || undefined, recipient: to});
  };
  return (
   <Flex flex = {1} bg="white">
      <IconButton 
        onPress={()=> navigation.goBack()}
        icon={<Icon as = {AntDesign} name="arrowleft"/>}
        alignSelf="flex-start"
       />
       <FollowersList onActionButtonClick={(follower)=>  sharePost(follower, post) } />

   </Flex>
  )
}
