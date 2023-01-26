import { AntDesign, Entypo } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
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
    ArrowBackIcon,
    useToast,
    HStack,
    Box,
    VStack,
} from 'native-base';
import React, { FC, useMemo, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Modal, Platform, useWindowDimensions } from 'react-native';
import { useAppSelector } from '../hooks/redux';
import { Profile } from '../types/Profile';
import {
    updateProfileInfo,
    uploadFileToFirestore,
} from '../services/profileServices';
import { setProfile } from '../reducers/profileSlice';
import { useDispatch } from 'react-redux';
import { Recipient } from '../types/Conversation';
import { conversationExists } from '../services/messageServices';
import { ImagePreview } from './ImagePreview';
import { DatingCover } from './DatingCover';

const datingCover = require('../assets/images/datingcover1.jpg');

export const DatingProfile: FC<{ profile?: Profile }> = ({ profile }) => {
    const { auth, chats, block } = useAppSelector(({ auth, chats, block }) => ({
        auth,
        chats,
        block,
    }));
    const blocked = useMemo(
        () =>
            (block?.blocked || []).filter(
                (userId, i) => userId === profile?.userId
            ),
        [block]
    );
    const blockedBy = useMemo(
        () =>
            (block?.blockedBy || []).filter(
                (userId, i) => userId === profile?.userId
            ),
        [block]
    );

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [isUploadingFromLibrary, setIsUploadingFromLibrary] =
        useState<boolean>(false);
    const [isUploadingFromCamera, setIsUploadingFromCamera] =
        useState<boolean>(false);
    const [isUploadingImages, setIsUploadingImages] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [datingCovers, setDatingCovers] = useState<string[]>([]);
    const [currentScrollIndex, setCurrentScrollIndex] = useState<number>(0);
    const toast = useToast();
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<any>>();
    const { datingProfile } = profile || {};
    // console.log({ datingProfile });

    const {
        onOpen: onOpenCoverModal,
        onClose: onCloseCoverModal,
        isOpen: isCoverModalOpen,
    } = useDisclose();

    const _uploadImage = async (uri: string) => {
        const coverpath = `dating_covers/${auth?.userId}`;
        const result = await uploadFileToFirestore(coverpath, uri);
        const newProfile = { ...(profile || {}) };
        if (result.status === 'success') {
            dispatch(
                setProfile({
                    ...newProfile,
                    datingProfile: {
                        ...(datingProfile || {}),
                        coverUrl: result.url,
                    },
                })
            );
            updateProfileInfo(auth?.userId || '', {
                datingProfile: { ...datingProfile, coverUrl: result.url },
            });
        }
        if (result.status === 'failed') {
            toast.show({
                title: 'Upload Failed',
                variant: 'solid',
                description:
                    (result?.message as string) ||
                    'unexpected error, Make sure you have a good internet connection',
            });
        }
    };
    const _uploadImages = async () => {
        const coverpath = `dating_covers/${auth?.userId}`;
        const covers = [];
        setIsUploadingImages(true);
        for (let i = 0; i < datingCovers.length; i++) {
            const result = await uploadFileToFirestore(
                `${coverpath}-${i}`,
                datingCovers[i]
            );
            if (result.status === 'success') {
                covers.push(result.url);
                setUploadProgress(uploadProgress + 1);
            } else {
                // console.log(result);
            }
        }
        if (covers.length) {
            const newProfile = { ...(profile || {}) };
            dispatch(
                setProfile({
                    ...newProfile,
                    datingProfile: { ...(datingProfile || {}), covers },
                })
            );
            updateProfileInfo(auth?.userId || '', {
                datingProfile: { ...datingProfile, covers },
            });
            setDatingCovers([]);
            onCloseCoverModal();
        }
        setIsUploadingImages(false);
    };
    const pickImageFromGallery = async () => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            aspect: [16, 9],
            quality: 0.2,
            allowsEditing: true,
        });
        if (!pickerResult.cancelled) {
            setDatingCovers((covers) => [...(covers || []), pickerResult.uri]);
        }
    };

    const pickImageFromCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            return;
        }
        const pickerResult = await ImagePicker.launchCameraAsync({
            aspect: [16, 9],
            quality: 0.2,
            allowsEditing: true,
        });
        if (!pickerResult.cancelled) {
            setDatingCovers((covers) => [...(covers || []), pickerResult.uri]);
        }
    };
    const message = () => {
        if (blocked.length) return;
        if (profile?.userId === auth?.userId) {
            return;
        }
        const to: Recipient = {
            userId: profile?.userId || '',
            photoUrl: profile?.profileUrl || '',
            fullname: profile?.loginInfo?.fullname || '',
            username: profile?.loginInfo?.username || '',
        };

        const conversationId = conversationExists(profile?.userId || '', chats);

        navigation.navigate('Message', {
            screen: 'MessageBubble',
            params: {
                conversationId: conversationId || undefined,
                recipient: to,
            },
        });
        // navigation.navigate("MessageBubble", { conversationId : conversationId || undefined, recipient: to});
    };

    const removePreview = (i: number) => {
        const coverCopy = [...(datingCovers || [])];
        coverCopy.splice(i, 1);
        setDatingCovers(coverCopy);
    };
    return (
        <ScrollView flex={1}>
            <Flex flex={1} bg="white">
                <Flex direction="row" alignItems="center">
                    <IconButton
                        size="sm"
                        icon={<ArrowBackIcon />}
                        onPress={() => navigation.goBack()}
                    />
                    <Heading ml={10} fontSize="md">
                        Dating Profile
                    </Heading>
                </Flex>
                {datingProfile?.covers && datingProfile?.covers.length ? (
                    <>
                        <ScrollView
                            horizontal={true}
                            pagingEnabled={true}
                            scrollEventThrottle={16}
                            onMomentumScrollEnd={({ nativeEvent }) => {
                                const positionX = nativeEvent.contentOffset.x;
                                const index = Math.round(
                                    positionX / windowWidth
                                );
                                setCurrentScrollIndex(index);
                            }}
                        >
                            {datingProfile?.covers.map((value, index) => (
                                <DatingCover
                                    userId={profile?.userId || ''}
                                    key={`cover-${index}`}
                                    imageUri={value}
                                    index={index}
                                />
                            ))}
                        </ScrollView>
                    </>
                ) : (
                    <Flex width={windowWidth} height={windowHeight * 0.4}>
                        <Image
                            alt="cover image"
                            source={
                                datingProfile?.coverUrl
                                    ? { uri: datingProfile.coverUrl }
                                    : datingCover
                            }
                            position="absolute"
                            width={windowWidth}
                            height={windowHeight * 0.39}
                            borderBottomRadius="2xl"
                            fallbackSource={datingCover}
                        />
                        {auth?.userId === profile?.userId ? (
                            <IconButton
                                ml="auto"
                                mt="auto"
                                mr={5}
                                mb={5}
                                icon={
                                    <Icon
                                        color="primary.500"
                                        as={AntDesign}
                                        name="edit"
                                    />
                                }
                                onPress={onOpenCoverModal}
                            />
                        ) : null}
                    </Flex>
                )}
                {datingProfile?.covers?.length ? (
                    <Flex direction="row" justifyContent="center" py={3}>
                        <HStack space={3}>
                            {datingProfile?.covers.map((value, index) => (
                                <Box
                                    key={`paginationdot-${index}`}
                                    width={2}
                                    height={2}
                                    borderRadius={4}
                                    bg={
                                        currentScrollIndex === index
                                            ? 'primary.500'
                                            : 'gray.300'
                                    }
                                ></Box>
                            ))}
                        </HStack>
                    </Flex>
                ) : null}
                <Flex direction="column" px={5}>
                    <Heading mb={1} mt={5} fontSize="xl">
                        {datingProfile?.alias ||
                            profile?.loginInfo?.fullname ||
                            ''}
                    </Heading>
                    <Flex direction="row" mt={5}>
                        {auth?.userId !== profile?.userId ? (
                            !blockedBy.length ? (
                                <Button
                                    size="md"
                                    mt={3}
                                    onPress={() => message()}
                                >
                                    Message
                                </Button>
                            ) : (
                                <Icon
                                    as={Entypo}
                                    name="block"
                                    color="red.300"
                                />
                            )
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    size="md"
                                    onPress={() =>
                                        navigation.navigate(
                                            'Edit Dating Profile',
                                            {
                                                profile,
                                            }
                                        )
                                    }
                                >
                                    Edit
                                </Button>
                                <Button
                                    ml="auto"
                                    variant="outline"
                                    onPress={onOpenCoverModal}
                                >
                                    Add Photos
                                </Button>
                            </>
                        )}
                    </Flex>

                    <Heading fontSize="sm" mt={5} mb={1}>
                        Profile
                    </Heading>
                    <Text fontSize="md">
                        {datingProfile?.profile || 'No Dating Profile yet ❤️ '}
                    </Text>
                    <Heading fontSize="sm" mt={5} mb={1}>
                        Relationship Status
                    </Heading>
                    <Text fontSize="md">
                        {datingProfile?.status || 'No status available'}
                    </Text>
                    {datingProfile?.showBloodGroup ? (
                        <Flex mt={5} mb={1} direction="row">
                            <VStack space={1}>
                                <Heading fontSize="sm">Blood Group</Heading>
                                <Text fontSize="md">
                                    {datingProfile?.bloodGroup || 'Unavailable'}
                                </Text>
                            </VStack>
                            <VStack space={1} ml={8}>
                                <Heading fontSize="sm">Genotype🩸</Heading>
                                <Text fontSize="md">
                                    {datingProfile?.genotype || 'Unavailable'}
                                </Text>
                            </VStack>
                        </Flex>
                    ) : null}
                    <HStack mt={5} mb={2} space={3} flexWrap="wrap">
                        {datingProfile?.smoking ? (
                            <VStack space={1}>
                                <Heading fontSize="sm">Smokes🚬 </Heading>
                                <Text fontSize="md">
                                    {datingProfile?.smoking ? 'yes' : 'no'}
                                </Text>
                            </VStack>
                        ) : null}
                        {datingProfile?.drinking ? (
                            <VStack space={1} ml={8}>
                                <Heading fontSize="sm">Drinks🥃 </Heading>
                                <Text fontSize="md">
                                    {datingProfile?.drinking ? 'yes' : 'no'}
                                </Text>
                            </VStack>
                        ) : null}
                    </HStack>
                    <HStack mt={5} mb={3} space={3} flexWrap="wrap">
                        {datingProfile?.kids ? (
                            <VStack space={1}>
                                <Heading fontSize="sm">Have kids</Heading>
                                <Text fontSize="md">
                                    {datingProfile?.kids ? 'yes' : 'no'}
                                </Text>
                            </VStack>
                        ) : null}
                        {datingProfile?.kids && datingProfile.noOfKids ? (
                            <VStack space={1} ml={8}>
                                <Heading fontSize="sm">Number of Kids </Heading>
                                <Text fontSize="md">
                                    {datingProfile?.noOfKids}
                                </Text>
                            </VStack>
                        ) : null}
                    </HStack>
                    
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
                            <Text
                                fontSize="md"
                                fontWeight="semibold"
                                color="muted.300"
                            >
                                No interest added Yet 🍔
                            </Text>
                        )}
                    </Flex>
                </Flex>

                <Modal
                    visible={isCoverModalOpen}
                    transparent={true}
                    animationType="slide"
                >
                    <Flex
                        bg="white"
                        marginTop="auto"
                        shadow="5"
                        borderRadius="2xl"
                        pb={10}
                        direction="column"
                        p={5}
                    >
                        <Heading mb={1}>Select Photos</Heading>
                        <Text mb={3}>Select at least 3 to 5 pictures</Text>
                        <Flex
                            direction="row"
                            flexWrap="wrap"
                            py={3}
                            width="100%"
                        >
                            {datingCovers?.length
                                ? datingCovers.map((uri, i) => (
                                      <ImagePreview
                                          key={`imageuri-${i}`}
                                          uri={uri}
                                          remove={() => removePreview(i)}
                                      />
                                  ))
                                : null}
                        </Flex>
                        {isUploadingImages ? (
                            <Text>{`Uploaded ${uploadProgress} of ${datingCovers.length} images`}</Text>
                        ) : null}
                        <Flex
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Button
                                disabled={datingCovers?.length >= 5}
                                isLoading={isUploadingFromLibrary}
                                isLoadingText="Uploadiing Image"
                                size="md"
                                variant="outline"
                                onPress={pickImageFromGallery}
                            >
                                Pick From Gallery
                            </Button>
                            <Button
                                isLoading={isUploadingFromCamera}
                                isLoadingText="Uploading Image"
                                size="md"
                                variant="outline"
                                onPress={pickImageFromCamera}
                                disabled={
                                    datingCovers?.length >= 5 ||
                                    isUploadingImages
                                }
                            >
                                Pick From Camera
                            </Button>
                        </Flex>

                        <Button
                            isLoading={isUploadingImages}
                            isLoadingText="Uploading Image"
                            size="md"
                            my={3}
                            onPress={_uploadImages}
                            disabled={isUploadingImages}
                        >
                            Upload Images
                        </Button>
                        <Button
                            disabled={isUploadingImages}
                            size="lg"
                            variant="outline"
                            onPress={onCloseCoverModal}
                        >
                            Cancel
                        </Button>
                    </Flex>
                </Modal>
            </Flex>
        </ScrollView>
    );
};
