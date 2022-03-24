import React, { FC } from 'react';
import { Flex, Heading, Text, Pressable } from 'native-base';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { DrawerParamList } from '../types';
import { Checklist } from '../types/System';

export type CheckListCardProps = {
    title?: string;
    description?: string;
    background?: string;
    path: keyof DrawerParamList;
    key: keyof Checklist;
};

export const CheckListCard: FC<CheckListCardProps> = ({ title = "", description = "", background = "primary.200", path = "Posts" }) => {
    const navigation = useNavigation<NavigationProp<DrawerParamList>>()
    return (
        <Pressable onPress={ () => navigation.navigate(path) }>
            <Flex direction="column"  p={5} width="2xs" maxHeight="2xs" flex = {1} bg = {background} borderRadius="lg" mr={4}>
                <Heading fontSize="xl" width="80%" my ={3}>{title}</Heading>
                <Text fontSize="xs">{description}</Text>
            </Flex>
        </Pressable>
    );
};
