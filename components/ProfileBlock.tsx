import { AntDesign, Entypo } from '@expo/vector-icons';
import {
    Button,
    Flex,
    Icon,
    Text,
    useToast,
} from 'native-base';
import React, { FC, useState } from 'react';
import { useAppSelector } from '../hooks/redux';
import { blockUser, unBlockUser } from '../services/authServices';
import { Profile } from '../types/Profile';
type ProfileBlockProps = {
    user: Profile;
    onReport: () => void;
    onCancel: () => void;
    userId: string;
    onBlockSuccess: (userId: string) => void;
};
export const ProfileBlock: FC<ProfileBlockProps> = ({
    onReport,
    user,
    onCancel,
    onBlockSuccess,
}) => {
    const [blocking, setBlocking] = useState<boolean>(false);
    const { block: userBlock, auth } = useAppSelector(({block, auth})=> ({block, auth}) )
    const toast = useToast();
    const block = async () => {
        try {
            setBlocking(true);
            const res = await blockUser({blockeeId: user.userId, blockerId: auth?.userId || "" }, userBlock);
            setBlocking(false)
            onBlockSuccess(user.userId);
        } catch (error) {
            console.log(error);
            const err: any = error;
            toast.show({
                title: 'Error Occured',
                description: err?.message || 'Unknown Error',
                status: 'error',
            });
        } finally {
            setBlocking(false);
        }
    };
    
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    if (showConfirm) {
        return (
            <Flex px={5} py={3}>
                <Text
                    my={3}
                >{`Are you sure you want to block ${user.loginInfo.username} ?`}</Text>
                <Flex direction="row" justifyContent="space-between" px={2}>
                    <Button
                        isLoading={blocking}
                        onPress={()=> block()}
                        variant="solid"
                        colorScheme="primary"
                    >
                        Yes
                    </Button>
                    <Button
                        variant="outline"
                        onPress={() => setShowConfirm(false)}
                        colorScheme="primary"
                    >
                        no
                    </Button>
                </Flex>
            </Flex>
        );
    }
    return (
        <Flex justifyContent="center">
            <Button
                borderRadius="lg"
                onPress={onReport}
                leftIcon={<Icon as={AntDesign} name="flag" />}
                variant="outline"
                colorScheme="primary"
                my={3}
            >
                Report {`${user.loginInfo.username}`}
            </Button>
            <Button
                onPress={() => setShowConfirm(true)}
                leftIcon={<Icon as={Entypo} name="block" />}
                variant="outline"
                colorScheme="primary"
                my={3}
            >
                Block {`${user.loginInfo.username}`}
            </Button>

            <Button onPress={onCancel} size="md" mt={5} variant="solid">
                Cancel
            </Button>
        </Flex>
    );
};
