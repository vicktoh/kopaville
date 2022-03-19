import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Flex, Heading, HStack, Icon, IconButton, ScrollView, Text, VStack } from 'native-base';
import React, { FC } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { JobStackParamList } from '../types';
import * as WebBrowser from 'expo-web-browser';
export const JobDetailsScreen: FC<NativeStackScreenProps<JobStackParamList, 'Job Details'>> = ({
    route,
    navigation,
}) => {
    const { job } = route.params;
    const {height: windowHeight} = useWindowDimensions();
    return (
        <ScrollView flex={1} bg="white">
            <Flex  px={5} py={5} position="relative">
                <View style = {{width: 250, height: 250, backgroundColor: "#FDFBF0", borderRadius: 125, position: "absolute", top: 50, right: -100}} ></View>
                <View style = {{width: 100, height: 100, backgroundColor: "#FDFBF0", borderRadius: 10, position: "absolute", top: windowHeight/2, transform: [{rotate: '45deg'}],  left: 10}} ></View>
                <Flex direction="row">
                    <IconButton icon={<Icon as={AntDesign} name="arrowleft" />} onPress={() => navigation.goBack()} />
                </Flex>
                <Heading my={5}>{job?.title ? "Job Opening": "Business/Service"}</Heading>

                <Heading fontSize="lg" mb={1}>{job?.title || job?.name}</Heading>
                {job?.description ? <Text fontSize="md">{job?.description}</Text> : null}
                <HStack my={3} space = {2}>
                    <Icon size="sm" as={Entypo} color="primary.400" name="location-pin" />
                    <Text fontSize="md">{job?.location || job?.address}</Text>
                </HStack>
                {
                    job?.organisation ? (
                        <VStack my={3}>
                            <Heading fontSize="lg" my={1}>Organisation</Heading>
                            <Text fontSize="md">{job.organisation}</Text>
                        </VStack>
                    ):
                    null
                }
                <Heading fontSize="lg">{job?.criteria ? "Criteria": "Services" }</Heading>
                {
                    job?.criteria ? (
                        job.criteria.map((cri, i) => (
                            <HStack key = {`criteria-${i}`} alignItems="center">
                                <Icon  as = {Entypo} name="dot-single" color = "primary.300"/>
                                <Text>{cri}</Text>
                            </HStack>
                        ))
                    ):
                    null
                }
                {
                    job?.services ? (
                        job.services.map((service, i) => (
                            <HStack alignItems="center" key = {`services-${i}`}>
                                <Icon  as = {Entypo} color= "primary.300" name="dot-single" />
                                <Text>{service}</Text>
                            </HStack>
                        ))
                    ):
                    null
                }
                {
                    job?.instagram || job?.twitter ?
                    (
                        <Flex>
                            <Heading fontSize="lg">Socials</Heading>
                            <HStack space = {2} my={2}>
                                {
                                    job?.instagram ? (
                                        <IconButton onPress={()=> job.instagram && WebBrowser.openBrowserAsync(job.instagram) } icon = {<Icon as ={AntDesign} name = "instagram" color = "primary.400" />} />
                                    ):
                                    null
                                }
                                {
                                    job?.twitter ? (
                                        <IconButton onPress={ () => job.twitter && WebBrowser.openBrowserAsync(job.twitter) } icon = {<Icon as ={Feather} name = "twitter" color = "primary.400" />} />
                                    ):
                                    null
                                }
                            </HStack>
                        </Flex>
                    )
                    : null
                }
                {
                    job?.link ? 
                    <Button onPress={()=> WebBrowser.openBrowserAsync(job.link) } my = {5} variant = "solid" size = "lg">{job?.name ? "Visit Business Page" : "Apply for this Job" }</Button>:
                    null
                }
            </Flex>
        </ScrollView>
    );
};
