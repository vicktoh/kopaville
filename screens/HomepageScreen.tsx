import React, { FC } from 'react';
import {
    Box,
    Heading,
    ScrollView,
    Flex,
    Button,
    Divider,
    ArrowBackIcon,
    KeyboardAvoidingView,
    IconButton,
    Icon,
    useDisclose,
    Fab,
} from 'native-base';
import { Modal, Platform, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerParamList, HomeStackParamList } from '../types';
import { SetupChecklist } from '../components/SetupChecklist';
import { useAppSelector } from '../hooks/redux';
import { countComplette, onboardingCheckListComplete } from '../services/helpers';
import { UserTimeline } from '../components/UserTimeline';
import { AddPostForm } from '../components/AddPostForm';
import { AntDesign } from '@expo/vector-icons';
import { usernameExists } from '../services/authServices';
const corperTwins = require('../assets/images/corpertwins.png');
type HomepageScreenProps = NativeStackScreenProps<HomeStackParamList, "New Post">;
export const HomepageScreen: FC<HomepageScreenProps> = ({ navigation }) => {
    const { width, height } = useWindowDimensions();
    const { auth, systemInfo } = useAppSelector(({ auth, systemInfo }) => ({ auth, systemInfo }));
    const firstname = (auth?.displayName || '').split(' ')[0];
    const showChecklist = !!!(systemInfo?.checkList && onboardingCheckListComplete(systemInfo.checkList));
    const { onOpen: onOpenPostModal, onClose: onClosePostModal, isOpen: isPostModalOpen } = useDisclose();
    const count = systemInfo?.checkList ? countComplette(systemInfo.checkList) : 0;

    return (
        <Flex flex={1} bg="white">
            {showChecklist ? (
                <Flex py={2} flex={3} minHeight="50">
                    <Flex px={5} direction="row" mt={5}>
                        <Heading fontSize="xl">{auth ? `Hello, ${firstname}👋🏽` : 'Hello there👋🏽'}</Heading>
                    </Flex>
                    <SetupChecklist />
                </Flex>
            ) : null}
            <UserTimeline />
            <Modal visible={isPostModalOpen} transparent={true} animationType="slide">
                <KeyboardAvoidingView
                    style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <Flex flex={1} borderWidth={3} borderColor="red" backgroundColor="rgba(0, 0, 0, 0.2)">
                        <Flex marginTop="auto" bg="white" px={5} py={10} borderRadius="2xl" shadow="4">
                            <Heading>Add Post</Heading>
                            <AddPostForm onClose={onClosePostModal} />
                        </Flex>
                    </Flex>
                </KeyboardAvoidingView>
            </Modal>

            <IconButton
                mt="auto"
                position="absolute"
                variant="solid"
                rounded="full"
                backgroundColor='primary.500'
                size="lg"
                top={height - 0.3 * height}
                right={5}
                onPress={()=> navigation.navigate("New Post")}
                icon={<Icon as={AntDesign} name="plus" />}
            />
        </Flex>
    );
};
