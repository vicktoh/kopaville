import { AntDesign } from '@expo/vector-icons';
import { Flex, ScrollView, Image, IconButton, Icon, Heading, Text, Button, Box, useDisclose, KeyboardAvoidingView } from 'native-base';
import React, { FC } from 'react';
import { Modal, Platform, useWindowDimensions, View } from 'react-native';
import { useAppSelector } from '../hooks/redux';
import { Profile } from '../types/Profile';
import { DatingProfileForm } from './DatingProfileForm';

const datingCover = require('../assets/images/datingcover.png');

export const DatingProfile: FC<{ profile?: Profile }> = ({ profile }) => {
    const { auth } = useAppSelector(({ auth }) => ({ auth }));
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const { datingProfile } = profile || {};
    const {onOpen:onOpenDatingProfileModal, onClose: onCloseDatingProfileModal, isOpen: isDatingProfileModalOpen}  = useDisclose();
    return (
        <ScrollView>
            <Flex flex={1} bg="white" safeArea>
                <Flex width={windowWidth} height={windowHeight * 0.4} borderBottomRadius="2xl">
                    <Image
                        alt=""
                        source={datingProfile?.coverUrl ? { uri: datingProfile.coverUrl } : datingCover}
                        position="absolute"
                        width={windowWidth}
                        height={windowHeight * 0.39}
                        borderRadius="2xl"
                    />
                    <IconButton
                        ml="auto"
                        mt="auto"
                        mr={5}
                        mb={5}
                        icon={<Icon color="primary.500" as={AntDesign} name="edit" />}
                    />
                </Flex>
                <Flex direction="column" px={5}>
                    <Heading mb={1} mt={5} fontSize="xl">
                        {profile?.loginInfo?.fullname || ''}
                    </Heading>
                    <Text fontSize="md">@{profile?.loginInfo?.username}</Text>

                    <Flex direction="row" mt={5}>
                        {auth?.userId !== profile?.userId ? (
                            <Button size="md" mt={3}>
                                Message
                            </Button>
                        ) : (
                            <Button variant="outline" size="md" onPress={onOpenDatingProfileModal}>
                                Edit
                            </Button>
                        )}
                    </Flex>

                    <Heading fontSize="md" mt={5} mb={1}>Profile</Heading>
                    <Text fontSize="md">{datingProfile?.profile || 'No Dating Profile yet ❤️ '}</Text>
                    <Heading fontSize="md" mt={5} mb={1}>
                        Relationship Status
                    </Heading>
                    <Text fontSize="md">{datingProfile?.status || "No status available"}</Text>
                    <Heading fontSize="md" mt={5} mb={1}>
                        Interests
                    </Heading>
                    <Flex direction='row' flexWrap="wrap">
                    {datingProfile?.interest ? (
                        datingProfile.interest.map((interest) => <Button mr={1} px={2} _text={{color: 'primary.400'}} size="sm" bg="secondary.200" borderRadius="full" key={interest}>{interest}</Button>)
                    ) : (
                        <Text fontSize="md" fontWeight="semibold" color="muted.300">
                            No interest added Yet 🍔
                        </Text>
                    )}
                    </Flex>
                    
                </Flex>
                <Modal visible={isDatingProfileModalOpen} transparent={true} animationType="slide">
                    <KeyboardAvoidingView
                        style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <ScrollView contentContainerStyle={{ flex: 1, paddingTop: 20 }}>
                            <Flex flex={1} borderColor="red" backgroundColor="rgba(0, 0, 0, 0.0)">
                                <Flex marginTop="auto" bg="white" px={5} py={10} borderRadius="2xl" shadow="4">
                                    <Heading>Dating Profile</Heading>
                                    <DatingProfileForm profile={profile?.datingProfile}  onClose={onCloseDatingProfileModal}/>
                                </Flex>
                            </Flex>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Modal>
            </Flex>
        </ScrollView>
    );
};
