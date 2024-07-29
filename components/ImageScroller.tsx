import React, {FC} from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, useWindowDimensions } from 'react-native';
import {Image} from 'expo-image'
// import { Image } from 'native-base';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
type ImageScrollerProps = {
    onLike : ()=>void;
    images: string [];
    postId: string;

}

export const ImageScroller: FC<ImageScrollerProps> = ({images, postId, onLike})=>{
    const {width : windowWidth} = useWindowDimensions();
   const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>{
    //    console.log(e)
   }
   return (
    <ScrollView horizontal style = {{ height: windowWidth * 5/4, width: windowWidth}} contentContainerStyle={{justifyContent: "center", alignItems: "center"}} pagingEnabled={true} >

        {
            images.map((uri, i)=>(
                <Image alt = "User post Image" source={uri} style = {{width: windowWidth - 10, height: (windowWidth -10) * 5/4}}  key = {`post-${postId}-${i}`} />
            ))
        }
    </ScrollView>
   )
}