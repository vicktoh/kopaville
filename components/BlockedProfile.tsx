import {
    Avatar,
    Flex,
    Heading,
    VStack,
    Text,
    Button,
    useToast,
} from 'native-base';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../hooks/redux';
import { setBlock } from '../reducers/blockSlice';
import { unBlockUser } from '../services/authServices';
import { getInitialsFromName } from '../services/helpers';
import { Profile } from '../types/Profile';

type BlockedProfileProps = {
    profile: Profile;
};
export const BlockedProfile: FC<BlockedProfileProps> = ({ profile }) => {
    const { block, auth } = useAppSelector(({ block, auth }) => ({
        block,
        auth,
    }));
    const { loginInfo, profileUrl, userId } = profile;
    const [blocking, setBlocking] = useState<boolean>(false);
    const dispatch = useDispatch();
    const toast = useToast();

    const unblock = async () => {
        try {
            setBlocking(true);
            const newBlocked = (block?.blocked || []).filter(
                (userid) => userid !== profile.userId
            );
            const res = await unBlockUser(
                { blockerId: auth?.userId || '', blockeeId: profile.userId },
                newBlocked
            );
            setBlocking(false);
            toast.show({
                title: `You have blocked ${profile?.loginInfo?.username} successfully`,
                status: 'success',
            });
            dispatch(setBlock({ ...block, blocked: newBlocked }));
        } catch (error) {
            console.log(error);
            const err: any = error;
            toast.show({
                title: 'Error Occured',
                description: err?.message || 'Unknown Error',
                status: 'error',
            });
        }
    };
    return (
        <Flex px={5}>
            <VStack>
                <Avatar
                    source={{ uri: profileUrl }}
                    size="xl"
                    bg="secondary.300"
                    color="primary.500"
                >
                    {getInitialsFromName(profile?.loginInfo?.fullname || '')}
                </Avatar>
                <Heading fontSize="xl" mt={3}>
                    {loginInfo?.fullname}
                </Heading>
                <Text fontSize="md">{`@${loginInfo?.username}`}</Text>
            </VStack>
            <Text my={2} fontSize="lg" color="red.200">
                This user has been blocked by you
            </Text>
            <Button
                onPress={unblock}
                isLoading={blocking}
                mt={5}
                variant="outline"
                colorScheme="red"
            >
                Unblock User
            </Button>
        </Flex>
    );
};
