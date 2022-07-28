import {
    Avatar,
    Button,
    FlatList,
    Flex,
    FormControl,
    Heading,
    HStack,
    Input,
    SearchIcon,
    Text,
    VStack,
} from 'native-base';
import React from 'react';
import { useMemo } from 'react';
import { FC } from 'react';
import { useState } from 'react';
import { ListRenderItemInfo } from 'react-native';
import { useAppSelector } from '../hooks/redux';
import { LoadingScreen } from '../screens/LoadingScreen';
import { Follower } from '../services/followershipServices';
import { getInitialsFromName } from '../services/helpers';

type FollowerListProps = {
    onActionButtonClick: (follower: Follower) => Promise<void>;
    actionButtonTitle?: string;
};

type FollowerComponentProps = {
   follower: Follower;
   onActionButtonClick: (follower: Follower) => Promise<void>;
}
const FollowerComponent: FC<FollowerComponentProps> = ({follower, onActionButtonClick}) => {
   const {fullname, photoUrl} = follower;
   const [sharing, setSharing] = useState<boolean>(false);

   const share = async ()=> {
      try {
         setSharing(true);
         await onActionButtonClick(follower)
      } catch (error) {
         console.log(error);
      }
      finally{
         setSharing(false);
      }
   }
   return(
<Flex
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <VStack alignItems="flex-start">
                    <Avatar size="sm" source={{uri: photoUrl }}>
                        {getInitialsFromName(fullname)}
                    </Avatar>
                    <Text fontSize="sm">{fullname}</Text>
                </VStack>

                <Button isLoading={sharing} size="sm" onPress={share}>
                    {'Send'}
                </Button>
            </Flex>
   )
}
export const FollowersList: FC<FollowerListProps> = ({
    onActionButtonClick,
    actionButtonTitle,
}) => {
    const { followerships } = useAppSelector(({ followerships }) => ({
        followerships,
    }));
    const [searchText, setSearchText] = useState<string>('');
    const followers = useMemo(() => {
        if (!searchText) return followerships?.followers;
        const filtered = (followerships?.followers || []).filter((follwer) => {
            const index = follwer.fullname.indexOf(searchText);
            return index > -1;
        });
        return filtered;
    }, [searchText]);

    const renderFollower = (data: ListRenderItemInfo<Follower>) => {
        return (
            <FollowerComponent follower={data.item} onActionButtonClick= {onActionButtonClick} />
        );
    };
    if (!followerships?.followers) {
        return <LoadingScreen />;
    }
    return followerships.followers.length ? 
      (
        <Flex direction="column" flex={1} px={5}>
            <Heading my={5} fontSize="lg">Choose Follower</Heading>
            <FormControl  width="100%" alignItems="center" my={3}>
                <Input
                     placeholder="search followers"
                    alignSelf="stretch"
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                    variant="outline"
                />
            </FormControl>
            <FlatList
                my={3}
                data={followers}
                flex={1}
                renderItem={renderFollower}
                keyExtractor={(item, i)=> item.userId}
            />
        </Flex>
    ):
    <Flex flex={1} alignItems="center" justifyContent="center">
      <Heading my={3}>No followers yest📭 </Heading>
      <Text my={3}>You do not have any followers yet</Text>
    </Flex>
    ;
};
