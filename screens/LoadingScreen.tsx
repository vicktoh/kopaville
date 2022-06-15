import { Flex, Text } from 'native-base';
import React, { FC } from 'react';
import { ActivityIndicator } from 'react-native';

type LoadingScreenProps = {
    label?: string;
};

export const LoadingScreen: FC<LoadingScreenProps> = ({ label }) => {
    return (
        <Flex flex={1} justifyContent="center" alignItems="center" bg= "white">
            <ActivityIndicator color="green" size={24} />
            <Text>{label ? `${label}`: "Please wait..."}</Text>{' '}
        </Flex>
    );
};
