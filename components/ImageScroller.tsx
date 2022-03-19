import React, {FC} from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, useWindowDimensions } from 'react-native';
import { Image, Pressable } from 'native-base';


type ImageScrollerProps = {
    onLike : ()=>void;
    images: string [];
    postId: string;

}

export const ImageScroller: FC<ImageScrollerProps> = ({images, postId, onLike})=>{
    const {width : windowWidth} = useWindowDimensions();

   const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>{
       console.log(e)
   }
   return (
    <ScrollView horizontal style = {{ height: windowWidth * 5/4, width: windowWidth}} contentContainerStyle={{justifyContent: "center", alignItems: "center"}} pagingEnabled={true} onScroll= {handleScroll}>

        {
            images.map((uri, i)=>(
                <Image alt = "User post Image" source={ {uri}} width = {windowWidth - 10} height = {(windowWidth -10) * 5/4} key = {`post-${postId}-${i}`} />
            ))
        }
    </ScrollView>
   )
}