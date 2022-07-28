import {
    AntDesign,
    Entypo,
    FontAwesome5,
    MaterialIcons,
} from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import {
    Badge,
    Flex,
    Heading,
    HStack,
    Icon,
    Pressable,
    Text,
    VStack,
} from 'native-base';
import React, { FC } from 'react';
import { ImageBackground, useWindowDimensions } from 'react-native';
import { JobStackParamList } from '../types';
import { Business, Job } from '../types/Job';

type JobCard = {
    job: Business & Job;
};

export const JobCard: FC<JobCard> = ({ job }) => {
    const date = job.dateAdded
        ? format(job.dateAdded?.toDate(), 'do MMM y')
        : '';
    const navigation = useNavigation<NavigationProp<JobStackParamList>>();
    const { width: windowWidth } = useWindowDimensions();
    return (
        <Pressable
            flex={1}
            onPress={() => navigation.navigate('Job Details', { job })}
        >
            <Flex
                borderWidth={1}
                position="relative"
                rounded="lg"
                borderColor="primary.400"
                mb={4}
            >
                {job.bannerUrl ? (
                    <Flex
                        height={(windowWidth * 1) / 3}
                        width="100%"
                        borderTopRadius="lg"
                        overflow="hidden"
                        mb={2}
                    >
                        <ImageBackground
                            source={{ uri: job.bannerUrl }}
                            style={{ flex: 1 }}
                        >
                            <Flex
                                right={0}
                                flex={1}
                                height={(windowWidth * 1) / 3}
                                width="100%"
                                bg="rgba(0, 0, 0, 0.3)"
                                position="absolute"
                            ></Flex>
                            <HStack
                                mt="auto"
                                mb={2}
                                alignItems="center"
                                space={2}
                                pl={5}
                            >
                                <Heading
                                    lineHeight="md"
                                    fontSize="lg"
                                    mb={1}
                                    color="white"
                                    noOfLines={2}
                                >
                                    {job?.name || job?.title}
                                </Heading>
                                {job.verified ? (
                                    <Icon
                                        size={5}
                                        as={MaterialIcons}
                                        color="primary.300"
                                        name="verified"
                                    />
                                ) : null}
                            </HStack>
                        </ImageBackground>
                    </Flex>
                ) : (
                    <HStack mb={3} mt={5} alignItems="center" space={2} mx={3}>
                        <Heading
                            lineHeight="md"
                            fontSize="lg"
                            mb={1}
                            noOfLines={2}
                        >
                            {job?.name || job?.title}
                        </Heading>
                        {job.verified ? (
                            <Icon
                                size={5}
                                as={MaterialIcons}
                                color="primary.300"
                                name="verified"
                            />
                        ) : null}
                    </HStack>
                )}
                <Flex px={5}>
                    {job?.organisation ? (
                        <Text fontSize="md" mb={3}>
                            {job.organisation}
                        </Text>
                    ) : null}
                    <HStack space={1} alignItems="center">
                        <Icon
                            size="xs"
                            as={Entypo}
                            color="primary.400"
                            name="location-pin"
                        />
                        <Text fontSize="sm">
                            {job?.location || job?.address}
                        </Text>
                    </HStack>
                    <VStack mt={3} pl={5}>
                        {job?.criteria
                            ? job.criteria
                                  .filter((cri, i) => i < 2)
                                  .map((cri, i) => (
                                      <Text
                                          ml={5}
                                          fontSize="xs"
                                          key={`criteria-${i}`}
                                      >
                                          {cri}
                                      </Text>
                                  ))
                            : null}
                        {job?.services
                            ? job.services
                                  .filter((cri, i) => i < 2)
                                  .map((cri, i) => (
                                      <Text
                                          ml={3}
                                          fontSize="xs"
                                          key={`criteria-${i}`}
                                      >
                                          {cri}
                                      </Text>
                                  ))
                            : null}
                    </VStack>

                    <Flex direction="row" justifyContent="flex-end">
                        <Text fontSize="sm" color="primary.400">
                            {date}
                        </Text>
                    </Flex>
                </Flex>
                <Badge
                    position="absolute"
                    top={5}
                    right={5}
                    rounded="lg"
                    bg={job?.title ? 'teal.300' : 'orange.300'}
                >
                    {job?.title ? 'Job' : 'Service'}
                </Badge>
            </Flex>
        </Pressable>
    );
};
