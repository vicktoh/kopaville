import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
    Flex,
    ScrollView,
    Image,
    IconButton,
    Icon,
    Heading,
    Text,
    Button,
    useDisclose,
    KeyboardAvoidingView,
    ArrowBackIcon,
    useToast,
    Progress,
} from 'native-base';
import React, { FC, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Modal, Platform, useWindowDimensions } from 'react-native';
import { useAppSelector } from '../hooks/redux';
import { Profile } from '../types/Profile';
import { DatingProfileForm } from './DatingProfileForm';
import { updateProfileInfo, uploadFileToFirestore } from '../services/profileServices';
import { setProfile } from '../reducers/profileSlice';
import { useDispatch } from 'react-redux';

const datingCover = require('../assets/images/datingcover1.jpg');

export const DatingProfile: FC<{ profile?: Profile }> = ({ profile }) => {
    const { auth } = useAppSelector(({ auth }) => ({ auth }));
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [isUploadingFromLibrary, setIsUploadingFromLibrary] = useState<boolean>(false);
    const [isUploadingFromCamera, setIsUploadingFromCamera] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const toast = useToast();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { datingProfile } = profile || {};
    const {
        onOpen: onOpenDatingProfileModal,
        onClose: onCloseDatingProfileModal,
        isOpen: isDatingProfileModalOpen,
    } = useDisclose();

    const { onOpen: onOpenCoverModal, onClose: onCloseCoverModal, isOpen: isCoverModalOpen } = useDisclose();

    const _uploadImage = async (uri: string) => {
        const coverpath = `dating_covers/${auth?.userId}`;
        const result = await uploadFileToFirestore(coverpath, uri);
        const newProfile = { ...(profile || {}) };
        if (result.status === 'success') {
            dispatch(setProfile({ ...newProfile, datingProfile: { ...(datingProfile || {}), coverUrl: result.url } }));
            updateProfileInfo(auth?.userId || '', { datingProfile: { ...datingProfile, coverUrl: result.url } });
        }
        if (result.status === 'failed') {
            toast.show({
                title: 'Upload Failed',
                status: 'error',
                description: result?.message as string || 'unexpected error, Make sure you have a good internet connection',
            });
        }
    };
    const pickImageFromGallery = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({ aspect: [3, 1], base64: true });
        if (!pickerResult.cancelled) {
            setIsUploadingFromLibrary(true);
            await _uploadImage(pickerResult.uri);
            setIsUploadingFromLibrary(false);
            onCloseCoverModal();
        }
    };
    const pickImageFromCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            return;
        }
        const pickerResult = await ImagePicker.launchCameraAsync({ aspect: [3, 1], base64: true });
        if (!pickerResult.cancelled) {
            setIsUploadingFromCamera(true);
            await _uploadImage(pickerResult.uri);
            setIsUploadingFromCamera(false);
            onCloseCoverModal();
        }
    };
    return (
        <ScrollView flex={1}>
            <Flex flex={1} bg="white" >
                <Flex direction="row" alignItems="center">
                    <IconButton size="sm" icon={<ArrowBackIcon />} onPress={() => navigation.goBack()} />
                    <Heading ml={10} fontSize="md">
                        Dating Profile
                    </Heading>
                </Flex>
                <Flex width={windowWidth} height={windowHeight * 0.4}>
                    <Image
                        alt="cover image"
                        source={datingProfile?.coverUrl ? { uri: datingProfile.coverUrl } : datingCover}
                        position="absolute"
                        width={windowWidth}
                        height={windowHeight * 0.39}
                        borderBottomRadius="2xl"
                        fallbackSource={datingCover}
                    />
                    { auth?.userId === profile?.userId ? (<IconButton
                        ml="auto"
                        mt="auto"
                        mr={5}
                        mb={5}
                        icon={<Icon color="primary.500" as={AntDesign} name="edit" />}
                        onPress={onOpenCoverModal}
                    />) :null}
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

                    <Heading fontSize="sm" mt={5} mb={1}>
                        Profile
                    </Heading>
                    <Text fontSize="md">{datingProfile?.profile || 'No Dating Profile yet ❤️ '}</Text>
                    <Heading fontSize="sm" mt={5} mb={1}>
                        Relationship Status
                    </Heading>
                    <Text fontSize="md">{datingProfile?.status || 'No status available'}</Text>
                    <Heading fontSize="sm" mt={5} mb={1}>
                        Interests
                    </Heading>
                    <Flex direction="row" flexWrap="wrap">
                        {datingProfile?.interest ? (
                            datingProfile.interest.map((interest) => (
                                <Button
                                    mr={1}
                                    px={2}
                                    _text={{ color: 'primary.400' }}
                                    size="sm"
                                    bg="secondary.200"
                                    borderRadius="full"
                                    key={interest}
                                >
                                    {interest}
                                </Button>
                            ))
                        ) : (
                            <Text fontSize="md" fontWeight="semibold" color="muted.300">
                                No interest added Yet 🍔
                            </Text>
                        )}
                    </Flex>
                </Flex>
                <Modal visible={isDatingProfileModalOpen} transparent={true} animationType="slide">
                    <ScrollView contentContainerStyle={{ flex: 1, paddingTop: 1 }}>
                        <KeyboardAvoidingView
                            style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        >
                            <Flex flex={1} borderColor="red" backgroundColor="rgba(0, 0, 0, 0.0)">
                                <Flex marginTop="auto" bg="white" px={5} py={10} borderRadius="2xl" shadow="4">
                                    <Heading>Dating Profile</Heading>
                                    <DatingProfileForm
                                        profile={profile?.datingProfile}
                                        onClose={onCloseDatingProfileModal}
                                    />
                                </Flex>
                            </Flex>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </Modal>
                <Modal visible={isCoverModalOpen} transparent={true} animationType="slide">
                    <Flex bg="white" marginTop="auto" shadow="5" borderRadius="2xl" pb={10} direction="column" p={5}>
                        <Heading mb={5}>Select Avatar</Heading>
                        <Button
                            isLoading={isUploadingFromLibrary}
                            isLoadingText="Uploadiing Image"
                            size="lg"
                            onPress={pickImageFromGallery}
                        >
                            Pick From Gallery
                        </Button>
                        <Button
                            isLoading={isUploadingFromCamera}
                            isLoadingText="Uploading Image"
                            size="lg"
                            my={3}
                            onPress={pickImageFromCamera}
                            disabled={isUploadingFromLibrary}
                        >
                            Pick From Camera
                        </Button>
                        <Button disabled={isUploadingFromCamera || isUploadingFromLibrary} size="lg" variant="outline" onPress={onCloseCoverModal}>
                            Cancel
                        </Button>
                    </Flex>
                </Modal>
            </Flex>
        </ScrollView>
    );
};
