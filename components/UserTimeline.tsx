import { Button, Flex, Heading, Text } from 'native-base';
import React, { FC, useState } from 'react';
import { string } from 'yup';
import { useAppSelector } from '../hooks/redux';

type UserTimelineProps = {
   
};
const EmptyTimeline: FC = () =>{
    return (
        <Flex mx={5} flex={1} direction="column" justifyContent="center" borderWidth={1} borderColor="primary.500" p= {10} borderRadius="xl">
            <Heading size="md" color="primary.500" my={3}>You have no content Yet!!</Heading>
            <Text lineHeight="xl">Post from people who you follow will appear here. Go to the explore page or find some people to follow</Text>
            <Button borderRadius="full" variant="outline" my={5} colorScheme='primary'>Explore 💫</Button>
            <Button borderRadius="full" bg="secondary.500" _text={{color: 'primary.500'}}>Find My Friends</Button>
        </Flex>
    )
}
export const UserTimeline: FC<UserTimelineProps> = () => {
    const posts = useAppSelector(({ posts }) => posts)
    return (
        <Flex flex={1} mt = {8}  direction="column"  >
            <Text ml={5} fontSize="md" mb={2}>Timeline</Text>
            {
                posts && posts.length ? (
                    <Flex>
                        <Text>TODO: update user profile</Text>
                    </Flex>
                ):
                <EmptyTimeline />
            }
        </Flex>
    )
};



