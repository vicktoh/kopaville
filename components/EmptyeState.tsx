import React, { FC } from 'react';
import { Flex, Heading, Text } from 'native-base';

type EmptyStateProps = {
    title?: string;
    description?: string;
};

export const EmptyState: FC<EmptyStateProps> = ({ title, description }) => {
    return (
        <Flex
            bg="white"
            p={5}
            flex={1}
            justifyContent="center"
            alignItems="center"
            my={2}
            borderWidth={1}
            borderColor="primary.300"
            borderRadius="lg"
        >
            <Heading mb={2} textAlign="center">{title || "There's nothing to show here"}</Heading>
            {description ? (
                <Text lineHeight="xl" textAlign="center">
                    { description || `Watch out on this space for jobs you can apply for in across different locations in Nigeria. You can
                    also post your own buisness or service for people to find you`}
                </Text>
            ) : null}
        </Flex>
    );
};
