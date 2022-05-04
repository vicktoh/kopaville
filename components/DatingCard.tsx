import { NavigationProp, useNavigation } from '@react-navigation/native';
import { differenceInCalendarYears } from 'date-fns';
import { Button, Flex, Heading, Image, Text, VStack } from 'native-base';
import React, {FC}  from 'react';
import { useWindowDimensions } from 'react-native';
import { DatingStackParamList } from '../types';
import { Profile } from '../types/Profile';

const datingCover = require('../assets/images/datingcover1.jpg');


export const DatingCard : FC<{profile: Profile}> = ({ profile})=>{
    const {width: windowWidth} = useWindowDimensions();
    const dateOfBirth =  profile?.profile?.dateOfBirth
    const age = React.useMemo(()=>(dateOfBirth ? differenceInCalendarYears( new Date(),  new Date(parseInt(dateOfBirth.year), parseInt(dateOfBirth.month), parseInt(dateOfBirth.day))) : ""), [profile]);
    const datingCoverUrl = profile?.datingProfile?.covers?.length ? profile.datingProfile.covers[0]:  profile?.datingProfile?.coverUrl;
    const navigation = useNavigation<NavigationProp<DatingStackParamList>>();
    return (
        <Flex my={2}  flex = {1} position = {'relative'} width = {windowWidth} height = {(windowWidth)* 4/5} borderRadius="2xl">
            <Image fallbackSource={datingCover} borderRadius="2xl" alt="dating cover" source={ datingCoverUrl ? {uri: datingCoverUrl} : datingCover } flex = {1} />
            <Flex bg="rgba(255,255,255,0.4)" width="100%" px={2} justifyContent="space-between" direction='row' py={3}  alignItems="center" position="absolute" bottom={0}>
                <VStack>
                    <Heading fontSize="md" color="white">{`${profile?.loginInfo?.fullname || ""} ${age}`}</Heading>
                    <Text fontSize="sm" color="white">{`${profile?.profile?.servingState || ""}`}</Text>
                </VStack>
                <Button variant="solid" size="sm" onPress={()=> navigation.navigate("Profile", {profile}) }>View Profile</Button>
            </Flex>

        </Flex>
    )
}