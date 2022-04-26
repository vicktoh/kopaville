import { Entypo } from '@expo/vector-icons';
import { Flex, Icon, IconButton, Image } from 'native-base';
import React, {FC}  from 'react';
import { DEFAULT_AVATAR_IMAGE } from '../constants/files';


type ImagePreviewProps = {
   uri: string;
   remove: () => void;
}



export const ImagePreview: FC<ImagePreviewProps> = ({ uri, remove})=>{
   

   return (
      <Flex position="relative" py={2} ml={2}>
         <Image source={ {uri}} width = {70*5/4} height={70} alt = "Image preview" fallbackSource={{uri: DEFAULT_AVATAR_IMAGE }} />
         <IconButton variant="solid" right={-3} position="absolute"  size="sm" onPress={remove}  icon = {<Icon size="xs" as ={Entypo} name = "cross"/>} />
      </Flex>
   )
}