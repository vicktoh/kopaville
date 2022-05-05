import { NavigationProp, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { Avatar, Flex, Heading, HStack, VStack, Text, Badge } from 'native-base';
import React, {FC} from 'react';
import { Pressable } from 'react-native';
import { MessageStackParamList } from '../types';
import { Conversation } from '../types/Conversation';
const defaultAvatar = require("../assets/images/avatar.png");



export const ChatListItem:FC<{conversation: Conversation, authId: string}> = ({conversation, authId}) => {
   const { conversationId, dateUpdated, unreadCount, members } = conversation;
   const recipient = members.find((member) => member.userId !== authId );
   const {photoUrl="", fullname = "", username = "", userId="" } = recipient || {}
   const formatedDate = format(dateUpdated, "k: mm");
   const navigation = useNavigation<NavigationProp<MessageStackParamList>>();
   return(
      <Pressable onPress={()=> navigation.navigate("MessageBubble", { conversationId, recipient: { fullname, username, userId, photoUrl }})}>
         <Flex py={3} borderBottomWidth={1} borderBottomColor="secondary.500" direction = "row" justifyContent="space-between">
         <HStack space = {2}>
            <Avatar size = "md" source={ photoUrl ? { uri: photoUrl} : defaultAvatar }  />
            <VStack>
               <Heading fontSize="md">{fullname}</Heading>
               <Text fontSize="md">{username}</Text>
            </VStack>
         </HStack>
         <VStack space = {2}>
            <Text>{formatedDate}</Text>
            {unreadCount  ? <Badge borderRadius="full" _text={{color: "white"}} bg="primary.400">{unreadCount}</Badge>: null}
         </VStack>
      </Flex>
      </Pressable>
      
   )
}