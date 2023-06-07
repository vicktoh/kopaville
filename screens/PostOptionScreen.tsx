import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { FC, ReactElement, ReactNode, useState } from 'react'
import { HomeStackParamList } from '../types'
import { Avatar, Button, Flex, HStack, Heading, Icon, IconButton, Image, Text, VStack, View, useToast } from 'native-base';
import { DEFAULT_AVATAR_IMAGE } from '../constants/files';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import { removePost } from '../services/postsServices';
type PostOptionScreenProps = NativeStackScreenProps<HomeStackParamList, "Option">;
const options: { label: string, to?: keyof Pick<HomeStackParamList, "Report"  | "Share">, icon: ReactElement}[] = [
   {
      label: 'Share',
      to: 'Share',
      icon: <Icon as={Feather} name="share" />
   },
   {
      label: 'Report Post',
      to: 'Report',
      icon: <Icon as={Feather} name="alert-circle" />
   },
   
]
export const PostOptionScreen: FC<PostOptionScreenProps> = ({ navigation, route }) => {
   const params = route?.params;
   const { post, userId,  } = params;
   const toast = useToast();
   const [isRemoving, setIsRemoving] = useState<boolean>();
   const navigateTo = (key?: keyof Pick<HomeStackParamList, "Report"  | "Share">) => {
      if(!key) return;
      switch(key) {
         case 'Report':
                     navigation.navigate('Report', { post });
                     break;
                 
                  case 'Share':
                     navigation.navigate('Share', { post, userId });
                     break;
                  default:
                     break;}
            
   }
   const deletePost = () => {
      if(!params.post.postId) return;
      try {
          setIsRemoving(true)
          removePost(params.post.postId);
          navigation.goBack();

      } catch (error) {
          setIsRemoving(false);
          const err: any = error;
          toast.show({
              title: 'Could not remove post',
              description: err?.message || 'Unexpected Error Try again',
              variant: 'subtle',
          });
      }
  };
   return (
       <Flex flex={1} bg="white" px={5}>
           <IconButton
               alignSelf="flex-start"
               icon={<Icon name="arrowleft" as={AntDesign} />}
               onPress={() => navigation.goBack()}
               my={5}
           />
           <HStack space={2} mb={2}>
               <Avatar
                   source={{
                       uri:
                           params.post.avartar.photoUrl || DEFAULT_AVATAR_IMAGE,
                   }}
                   size="sm"
               />
               <VStack>
                   <Heading size="sm">@{params.post.avartar.username}</Heading>
                   {post.mediaType === 'Image' && post.imageUrl && (
                       <Flex
                           direction="column"
                           width={100}
                           height={(4 / 3) * 100}
                           position="relative"
                           mt={1}
                       >
                           <Image
                               flex={1}
                               alt="Post image"
                               source={{ uri: post.imageUrl[0] }}
                           />
                       </Flex>
                   )}
                   {post.mediaType === 'Video' && (
                       <Icon name="video" as={Entypo} />
                   )}
                   {post.text && <Text>{post.text}</Text>}
               </VStack>
           </HStack>

           <Text>{params.post.text}</Text>

           <VStack space={2}>
               {post.creatorId === userId ? (
                   <Button variant="outline" onPress= {()=> navigation.navigate("Edit Post", { post })} leftIcon={<Icon name="edit" as={Feather} />}>
                       Edit
                   </Button>
               ) : null}
               {options.map((options, i) => (
                   <Button
                       colorScheme="primary"
                       leftIcon={options.icon}
                       key={`post-option-${i}`}
                       onPress={() => navigateTo(options.to)}
                       variant="outline"
                   >
                       <Text>{options.label}</Text>
                   </Button>
               ))}
               {post.creatorId === userId ? (
                   <Button
                       leftIcon={
                           <Icon name="trash" as={Feather} color="red.400" />
                       }
                       variant="outline"
                       isLoading={isRemoving}
                       onPress={deletePost}
                   >
                       Delete
                   </Button>
               ) : null}
           </VStack>
           <Button
               mt="auto"
               variant="outline"
               colorScheme="red"
               onPress={() => navigation.goBack()}
               mb={5}
           >
               Cancel
           </Button>
       </Flex>
   );
}
