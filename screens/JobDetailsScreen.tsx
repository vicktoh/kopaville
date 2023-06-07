import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    Button,
    CloseIcon,
    Flex,
    Heading,
    HStack,
    Icon,
    IconButton,
    ScrollView,
    Text,
    useDisclose,
    useToast,
    VStack,
} from 'native-base';
import React, { FC, useMemo } from 'react';
import { Modal, useWindowDimensions, View } from 'react-native';
import { AppStackParamList, JobStackParamList } from '../types';
import * as WebBrowser from 'expo-web-browser';
import * as Sharing from "expo-sharing";
import { useAppSelector } from '../hooks/redux';
import { removeJob } from '../services/jobServices';
import { Follower } from '../services/followershipServices';
import { conversationExists, sendMessage, startConversationWithMessage } from '../services/messageServices';
import { ChatType, Recipient } from '../types/Conversation';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Business, Job } from '../types/Job';
import { FollowersList } from '../components/FollowersList';
export const JobDetailsScreen: FC<
    NativeStackScreenProps<JobStackParamList, 'Job Details'>
> = ({ route, navigation }) => {
    const { job } = route.params;
    const { height: windowHeight } = useWindowDimensions();
    const messageNavigation = useNavigation<NavigationProp<AppStackParamList>>()
    const { auth, chats, block, profile } = useAppSelector(({ auth, chats, block, profile }) => ({
        auth,
        chats,
        block,
        profile
    }));

    const { isOpen, onClose, onOpen } = useDisclose();
   
    const toast = useToast();
    const deleteJob = async () => {
        if (!job.id) return;
        try {
            await removeJob(job.id);
            navigation.goBack();
        } catch (error) {
            const err: any = error;
            toast.show({
                title: 'Could not delete Job',
                description: err?.message || 'unexpected error',
            });
        }
    };
    
    const shareJob = async (follower: Follower, job: Job & Business) => {
        const blocked = (block?.blocked || []).filter(
            (userId, i) => userId === follower.userId);
        if (blocked.length) return;
        if (follower.userId === auth?.userId) {
            return;
        }
        const to: Recipient = {
            userId: follower?.userId || '',
            photoUrl: follower.photoUrl || '',
            fullname: follower.fullname || '',
            username: follower.username || '',
        };
        const from: Recipient={
            userId: auth?.userId || "",
            photoUrl: profile?.profileUrl || "",
            fullname: profile?.loginInfo.fullname || "",
            username: profile?.loginInfo.username || ""
        }
        
        const conversationId = conversationExists(follower?.userId || '', chats);
        if(conversationId){
            await sendMessage(conversationId, to, from, job.title || job.name, ChatType.job, job.link || "", job.title || "Name", job);
            onClose();
            // messageNavigation.navigate("Message", {
            //     screen: 'MessageBubble',
            //     params: {
            //         conversationId: conversationId || undefined,
            //         recipient: to,
            //     },
            // });
        } else{
            await startConversationWithMessage(from, to, job.title || job.name,(conversationid)=> {
                onClose();
                // messageNavigation.navigate("Message", {
                //     screen: 'MessageBubble',
                //     params: {
                //         conversationId: conversationId || undefined,
                //         recipient: to,
                //     },
                // });
            }, ChatType.job, job.link || "", job.title || job.name, job )
        }
        
        // navigation.navigate("MessageBubble", { conversationId : conversationId || undefined, recipient: to});
    };
    return (
        <ScrollView flex={1} bg="white">
            <Flex px={5} py={5} position="relative">
                <View
                    style={{
                        width: 250,
                        height: 250,
                        backgroundColor: '#FDFBF0',
                        borderRadius: 125,
                        position: 'absolute',
                        top: 50,
                        right: -100,
                    }}
                ></View>
                <View
                    style={{
                        width: 100,
                        height: 100,
                        backgroundColor: '#FDFBF0',
                        borderRadius: 10,
                        position: 'absolute',
                        top: windowHeight / 2,
                        transform: [{ rotate: '45deg' }],
                        left: 10,
                    }}
                ></View>
                <Flex direction="row">
                    <IconButton
                        icon={<Icon as={AntDesign} name="arrowleft" />}
                        onPress={() => navigation.goBack()}
                    />
                </Flex>
                <Heading my={5}>
                    {job?.title ? 'Job Opening' : 'Business/Service'}
                </Heading>

                <Heading fontSize="lg" mb={1}>
                    {job?.title || job?.name}
                </Heading>
                {job?.description ? (
                    <Text fontSize="md">{job?.description}</Text>
                ) : null}
                <HStack my={3} space={2}>
                    <Icon
                        size="sm"
                        as={Entypo}
                        color="primary.400"
                        name="location-pin"
                    />
                    <Text fontSize="md">{job?.location || job?.address}</Text>
                </HStack>
                {job?.organisation ? (
                    <VStack my={3}>
                        <Heading fontSize="lg" my={1}>
                            Organisation
                        </Heading>
                        <Text fontSize="md">{job.organisation}</Text>
                    </VStack>
                ) : null}
                <Heading fontSize="lg">
                    {job?.criteria ? 'Criteria' : 'Services'}
                </Heading>
                {job?.criteria
                    ? job.criteria.map((cri, i) => (
                          <HStack key={`criteria-${i}`} alignItems="center">
                              <Icon
                                  as={Entypo}
                                  name="dot-single"
                                  color="primary.300"
                              />
                              <Text>{cri}</Text>
                          </HStack>
                      ))
                    : null}
                {job?.services
                    ? job.services.map((service, i) => (
                          <HStack alignItems="center" key={`services-${i}`}>
                              <Icon
                                  as={Entypo}
                                  color="primary.300"
                                  name="dot-single"
                              />
                              <Text>{service}</Text>
                          </HStack>
                      ))
                    : null}
                {job?.instagram || job?.twitter ? (
                    <Flex>
                        <Heading fontSize="lg">Socials</Heading>
                        <HStack space={2} my={2}>
                            {job?.instagram ? (
                                <IconButton
                                    onPress={() =>
                                        job.instagram &&
                                        WebBrowser.openBrowserAsync(
                                            job.instagram
                                        )
                                    }
                                    icon={
                                        <Icon
                                            as={AntDesign}
                                            name="instagram"
                                            color="primary.400"
                                        />
                                    }
                                />
                            ) : null}
                            {job?.twitter ? (
                                <IconButton
                                    onPress={() =>
                                        job.twitter &&
                                        WebBrowser.openBrowserAsync(job.twitter)
                                    }
                                    icon={
                                        <Icon
                                            as={Feather}
                                            name="twitter"
                                            color="primary.400"
                                        />
                                    }
                                />
                            ) : null}
                        </HStack>
                    </Flex>
                ) : null}
                {job.creatorId === auth?.userId ? (
                    <Button
                        onPress={deleteJob}
                        variant="outline"
                        my={3}
                        size="lg"
                    >
                        Remove Post
                    </Button>
                ) : null}
                {job.creatorId === auth?.userId ? (
                    <Button
                        onPress={()=> navigation.navigate("Edit Job", { job })}
                        variant="outline"
                        my={3}
                        size="lg"
                    >
                        Edit Post
                    </Button>
                ) : null}
                <Button my={3} variant="outline" size="lg" onPress={onOpen}>Share</Button>
                {job?.link ? (
                    <Button
                        onPress={() => job.link &&  WebBrowser.openBrowserAsync(job.link)}
                        my={3}
                        variant="solid"
                        size="lg"
                    >
                        {job?.name
                            ? 'Visit Business Page'
                            : 'Apply for this Job'}
                    </Button>
                ) : null}
                
            </Flex>
            <Modal visible={isOpen} transparent={true} animationType="slide">
                <Flex safeArea flex={1} bg="white">
                    <IconButton onPress={onClose}  icon = {<CloseIcon size={5}/>} />
                    <FollowersList onActionButtonClick={(follower)=> shareJob(follower, job)} />
                </Flex>
            </Modal>
        </ScrollView>
    );
};
