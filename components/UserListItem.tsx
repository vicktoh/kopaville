import { NavigationProp, useNavigation } from '@react-navigation/native'
import { Avatar, Button, Flex, Heading, HStack, Text, VStack } from 'native-base'
import React, {FC} from 'react' 
import { HomeStackParamList } from '../types'
import { Profile } from '../types/Profile'

const defaultAvartar = require('../assets/images/avatar.png')

type UserListItemProps = {
    profile: Profile
}

export const UserListItem: FC<UserListItemProps> = ({profile}) => {
    const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

    return(
        <Flex direction = "row" justifyContent="space-between" width = "100%" py={3} borderBottomWidth={1} borderBottomColor="secondary.300" alignItems="center" px={3}>
            
                <HStack space = {2} alignItems="center">
                    <Avatar source={profile?.profileUrl ? {uri: profile.profileUrl} :  defaultAvartar }  size="md"> AV</Avatar>
                    <VStack>
                        <Heading fontSize="md">{profile?.loginInfo?.fullname || "Unknown User"}</Heading>
                        <Text fontSize="sm">{profile?.loginInfo?.username}</Text>
                    </VStack>
                </HStack>

                <Button size="sm" variant="solid" >Follow</Button>
        </Flex>
    )
    
}