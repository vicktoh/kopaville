import React, { FC } from 'react';
import { Flex, Text, FlatList, Heading } from 'native-base';
import { CheckListCardProps, CheckListCard } from './CheckListCard';
import { ListRenderItem } from 'react-native';
import { useAppSelector } from '../hooks/redux';
import { countComplette as countComplete } from '../services/helpers';

const ONBOARDING_CHECKLIST: CheckListCardProps[] = [
    {
        title: 'Complete Your Profile🧒🏽',
        description:
            'Hey there, you need to complete your profile, this will help us deliver better experience to you and tailor content specific to you',
        path: 'Profile',
        background: 'secondary.400',
        key: "Complete Profile",
    },
    {
        title: 'Complete Career Profile💼',
        description:
            'Setup your resume and work experience, this will help employers find you  for jobs and place of primary assignments',
        path: 'Career Profile',
        background: 'primary.200',
        key: 'Complete Career Profile'
    },
    {
        title: 'Setup Dating Profile❤️',
        description:
            'Looking for love?. Setup your dating profile and interest so that we can help you in the journey to find the one ',
        path: 'Dating Profile',
        background: 'red.200',
        key: 'Complete Dating Profile'
    },
];

export const SetupChecklist: FC = () => {
    const {auth, systemInfo} = useAppSelector(({auth, systemInfo }) => ({ auth , systemInfo}));
    const count = systemInfo?.checkList ? countComplete(systemInfo.checkList) : 0; 
    const renderChecklist: ListRenderItem<CheckListCardProps> = ({ item, index, separators }) => {
        if(systemInfo?.checkList && item?.path && systemInfo.checkList[item.key]){
            return null
        }
        return (
            <CheckListCard {...item} />
        );
    };
    return (
        <Flex mt = {8}>
            <Text ml={5} fontSize="md">{`Setup check list (${count}/${ONBOARDING_CHECKLIST.length})`}</Text>
            <FlatList contentContainerStyle={{paddingVertical: 10, paddingLeft: 20}} data={ONBOARDING_CHECKLIST}  renderItem = { renderChecklist} horizontal = {true}  />
        </Flex>
    );
};
