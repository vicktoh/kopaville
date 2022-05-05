import React, { FC } from 'react';

import { Flex, Text } from 'native-base';
import { Chat } from '../types/Conversation';
import { format } from 'date-fns/esm';
import { useWindowDimensions } from 'react-native';

type MessageBubbleProps = {
    authId: string;
    chat: Chat;
};

export const MessageBubble: FC<MessageBubbleProps> = ({
    authId,
    chat: { timestamp, message, toId, fromId },
}) => {
    const time = format(timestamp.toDate(), 'kk: mm');
    const { width: windowWidth } = useWindowDimensions();
    return (
        <Flex
            direction="row"
            justifyContent={authId === fromId ? 'flex-start' : 'flex-end'}
            my={2}
        >
            <Flex
                bg={authId === fromId ? 'primary.200' : 'secondary.200'}
                maxWidth= { windowWidth / 2 }
                px={5}
                pt={3}
                pb={3}
                borderRadius="xl"
            >
                <Text fontSize="sm">{message}</Text>
                <Text alignSelf="flex-end" color="primary.500" fontSize={8} >
                    {time}
                </Text>
            </Flex>
        </Flex>
    );
};
