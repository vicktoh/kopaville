import {
    Button,
    Flex,
    Heading,
    Text,
    Box,
    HStack,
    IconButton,
    Icon,
    useDisclose,
    useToast,
    Image,
    CloseIcon,
    VStack,
} from 'native-base';
import React, { FC, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { ProfileSection } from './ProfileSection';
import { Profile } from '../types/Profile';
import { Linking, Modal, useWindowDimensions, View } from 'react-native';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppStackParamList, DrawerParamList, HomeStackParamList } from '../types';
import * as ImagePicker from 'expo-image-picker';
import {
    updateProfileInfo,
    uploadProfilePicture,
} from '../services/profileServices';
import { setProfile } from '../reducers/profileSlice';
import {
    Follower,
    followUser,
    unfollowUser,
} from '../services/followershipServices';
import { differenceInCalendarYears } from 'date-fns';
import { useOpenLink } from '../hooks/useOpenLink';
import { BlockedProfile } from './BlockedProfile';
import { ProfileBlock } from './ProfileBlock';
import { setBlock } from '../reducers/blockSlice';
import { setFollowership } from '../reducers/followershipSlice';
import { ImagePickCropper } from './GalleryPicker/ImagePickCropper';
import { Recipient } from '../types/Conversation';
import { conversationExists } from '../services/messageServices';
import { sendNotification } from '../services/notifications';

const placeHolderImage = require('../assets/images/placeholder.jpeg');
type GeneralProfileProps = {
    profile: Profile;
    onEdit?: () => void;
};

export const GeneralProfile: FC<GeneralProfileProps> = ({
    profile,
    onEdit,
}) => {
    const {
        auth,
        profile: localProfile,
        followerships,
        block,
        
        chats
    } = useAppSelector(({ auth, profile, followerships, block, chats, }) => ({
        auth,
        profile,
        followerships,
        block,
        chats
    }));
    const {
        profile: generalProfile,
        careerProfile,
        datingProfile,
        userId,
    } = profile;
    const [isUploadingFromLibrary, setUploadingFromLibrary] =
        useState<boolean>(false);
    const [isLoadingFromCamera, setUploadingFromCamera] =
        useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { width: windowWidth } = useWindowDimensions();
    const { isOpen, onOpen, onClose } = useDisclose();
    const [photoSelectMode, setPhotoSelectMode] = useState<
        'camera' | 'gallery'
    >('gallery');

    const {
        isOpen: profilePreveiwOpen,
        onOpen: onOpenProfilePreview,
        onClose: oncloseProfilePreview,
    } = useDisclose();
    const {
        isOpen: photoPickerOpen,
        onOpen: onOpenPhotoPicker,
        onClose: onclosePhotoPicker,
    } = useDisclose();

    const {
        isOpen: reportViewOpen,
        onOpen: onOpenReportView,
        onClose: onCloseReportView,
    } = useDisclose();

    const dispatch = useAppDispatch();
    const navigation =
        useNavigation<NavigationProp<DrawerParamList & HomeStackParamList & AppStackParamList>>();
    const dateOfBirth = generalProfile?.dateOfBirth;
    const age = useMemo(
        () =>
            dateOfBirth
                ? differenceInCalendarYears(
                      new Date(),
                      new Date(
                          parseInt(dateOfBirth.year),
                          parseInt(dateOfBirth.month),
                          parseInt(dateOfBirth.day)
                      )
                  )
                : '',
        [profile.profile]
    );
    const toast = useToast();
    const following = useMemo(
        () =>
            (followerships?.following || []).filter(
                ({ userId }) => userId === profile.userId
            ),
        [followerships]
    );
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
    const { openLink } = useOpenLink();

    const pickImageFromCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            return;
        }

        try {
            setUploadingFromCamera(true);
            const pickerResult = await ImagePicker.launchCameraAsync({
                aspect: [1, 1],
                quality: 0.2,
                allowsEditing: true,
            });
            if (pickerResult.cancelled) {
                setUploadingFromCamera(false);
                return;
            }
            const url = await uploadProfilePicture(
                auth?.userId || '',
                pickerResult?.uri || ''
            );
            updateProfileInfo(auth?.userId || '', { profileUrl: url });
            dispatch(setProfile({ ...profile, profileUrl: url }));
        } catch (error) {
            console.log({ error });
        } finally {
            setUploadingFromCamera(false);
            onClose();
        }
    };
    const pickImageFromGallery = async () => {
        let permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted === false) {
            return;
        }
        try {
            setUploadingFromLibrary(true);
            let pickerResult: any = await ImagePicker.launchImageLibraryAsync({
                aspect: [1, 1],
                quality: 0.2,
                allowsEditing: true,
            });
            const url = await uploadProfilePicture(
                auth?.userId || '',
                pickerResult?.uri || ''
            );
            updateProfileInfo(auth?.userId || '', { profileUrl: url });
            dispatch(setProfile({ ...profile, profileUrl: url }));
        } catch (error) {
            console.log({ error });
        } finally {
            setUploadingFromLibrary(false);
            onClose();
        }
    };

    const follow = async () => {
        try {
            setLoading(true);
            const {
                userId = '',
                profileUrl = '',
                loginInfo: { username, fullname },
            } = profile;
            const follower: Follower = {
                userId,
                username,
                fullname,
                photoUrl: profileUrl,
            };

            await followUser(auth?.userId || '', follower);
            const newfollowership = {
                ...followerships,
                following: [...(followerships?.following || []), follower],
            };
            dispatch(setFollowership(newfollowership));
            const notificationMessage = `${localProfile?.loginInfo.fullname || ""} followed you`;
            sendNotification(notificationMessage, follower.userId);
            setLoading(false);
        } catch (error) {
            let err: any = error;
            toast.show({
                placement: 'top',
                title: 'error',
                description: err?.message || 'Could not follow user, Try again',
                color: "white",
                backgroundColor: "red.500",
            });
        } finally {
            setLoading(false);
        }
    };
    const unfollow = async () => {
        try {
            setLoading(true);
            await unfollowUser(auth?.userId || '', profile?.userId);
            const newfollowing = (followerships?.following || []).filter(
                ({ userId }) => userId !== profile?.userId
            );
            dispatch(
                setFollowership({ ...followerships, following: newfollowing })
            );
            setLoading(false);
        } catch (error) {
            console.log(error);
            let err: any = error;
            toast.show({
                placement: 'top',
                title: 'error',
                description: err?.message || 'Could not follow user, Try again',
                backgroundColor: "red.500",
                color: "white",
            });
        } finally {
            setLoading(false);
        }
    };
    const onBlockSuccess = async (userId: string) => {
        const newblocked = [...(block?.blocked || []), userId];
        dispatch(setBlock({ ...block, blocked: newblocked }));
        onCloseReportView();
        toast.show({
            title: `You have blocked ${profile.loginInfo.fullname} successfully`,
            variant: "subtle",
            color: "white",
            backgroundColor: "primary.300",
        });
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
    if (blocked?.length) {
        return <BlockedProfile profile={profile} />;
    }
    return (
        <Flex py={3} px={5} position="relative" bg="white">
            <View
                style={{
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                    transform: [{ rotate: '45deg' }],
                    backgroundColor: '#FDFBF0',
                    position: 'absolute',
                    top: 20,
                    right: -80,
                }}
            ></View>
            {/* {auth?.userId !== profile.userId ? (
                <BlockPopover onBlockClick={onOpenReportView} onReportClick = {()=> navigation.navigate("Report", { user: profile})} />
            ) : null} */}
            {auth?.userId !== profile.userId ? (
                <IconButton
                    position="absolute"
                    top={3}
                    right={5}
                    icon={
                        <Icon
                            size={6}
                            as={Entypo}
                            name="block"
                            color="red.500"
                        />
                    }
                    onPress={onOpenReportView}
                    zIndex={5}
                />
            ) : null}
            <ProfileSection
                onOpenPreview={onOpenProfilePreview}
                profile={profile}
                userId={auth?.userId || ''}
                promptAvatarChange={onOpen}
            />

            <HStack flexShrink={1} my={3} alignItems="center" space={2}>
                {auth?.userId === userId ? (
                    <Button
                        variant="outline"
                        onPress={() => onEdit && onEdit()}
                    >
                        Edit
                    </Button>
                ) : following.length ? (
                    <Button
                        variant="outline"
                        isLoading={loading}
                        onPress={unfollow}
                    >
                        Unfollow
                    </Button>
                ) : (
                    <Button
                        variant="solid"
                        isLoading={loading}
                        onPress={follow}
                    >
                        Follow
                    </Button>
                )}
                {generalProfile?.instagram ? (
                    <IconButton
                        variant="ghost"
                        ml={5}
                        onPress={() =>
                            generalProfile.instagram &&
                            openLink(generalProfile.instagram)
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
                {generalProfile?.twitter ? (
                    <IconButton
                        variant="ghost"
                        ml={3}
                        icon={
                            <Icon
                                as={Feather}
                                name="twitter"
                                color="primary.400"
                            />
                        }
                        onPress={() =>
                            generalProfile.instagram &&
                            openLink(generalProfile.instagram)
                        }
                    />
                ) : null}
                {generalProfile?.phoneNumber &&
                generalProfile.displayPhoneNumber ? (
                    <IconButton
                        variant="ghost"
                        ml={3}
                        icon={
                            <Icon
                                as={AntDesign}
                                name="phone"
                                color="primary.400"
                            />
                        }
                        onPress={() =>
                            generalProfile.phoneNumber &&
                            Linking.openURL(`tel:${generalProfile.phoneNumber}`)
                        }
                    />
                ) : null}
                {
                    auth?.userId !== profile?.userId && !blockedBy.length ? 
                            <Button
                                size="md"
                                onPress={() => message()}
                                variant="outline"
                            >
                                Message
                            </Button> : null
                }
            </HStack>
            {generalProfile?.displayAge && generalProfile?.dateOfBirth ? (
                <>
                    <Heading fontSize="sm" mt={5} mb={2}>
                        Age
                    </Heading>
                    <Text fontSize="md">{age}</Text>
                </>
            ) : null}
            {generalProfile?.lga ? (
                <>
                    <Heading fontSize="sm" mt={5} mb={2}>
                        L.G.A of Origin
                    </Heading>
                    <Text fontSize="md" flexWrap="wrap">{generalProfile.lga}</Text>
                </>
            ) : null}
            {generalProfile?.corperStatus ? (
                <>
                    <Heading fontSize="sm" mt={5} mb={2}>
                        Service Status
                    </Heading>
                    <Text fontSize="md">{generalProfile.corperStatus}</Text>
                </>
            ) : null}

            <Flex direction="row" mt={5} mb={2}>
                {generalProfile?.servingState ? (
                    <VStack>
                        <Heading fontSize="sm">Serving State</Heading>
                        <Text fontSize="md" flexWrap="wrap">{generalProfile.servingState}</Text>
                    </VStack>
                ) : null}
                {generalProfile?.servingLGA ? (
                    <VStack ml={generalProfile?.servingState ? 8 : 0}>
                        <Heading fontSize="sm">Serving L.G.A</Heading>
                        <Text fontSize="md" flexWrap="wrap">{generalProfile.servingLGA}</Text>
                    </VStack>
                ) : null}
            </Flex>
            {generalProfile?.ppa ? (
                <VStack flexShrink={1}>
                    <Heading fontSize="sm">Place of Primary Assignment</Heading>
                    <Text fontSize="md" flexWrap="wrap">{generalProfile.ppa}</Text>
                </VStack>
            ) : null}
            <Flex
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                mt={5}
                mb={2}
            >
                {generalProfile?.platoon ? (
                    <VStack flexShrink={1}>
                        <Heading fontSize="sm">Platoon</Heading>
                        <Text fontSize="md" flexWrap="wrap">{generalProfile.platoon}</Text>
                    </VStack>
                ) : null}
                {generalProfile?.camp ? (
                    <VStack flexShrink={1}>
                        <Heading fontSize="sm">Camp Location</Heading>
                        <Text fontSize="md" flexWrap="wrap">{generalProfile.camp}</Text>
                    </VStack>
                ) : null}
            </Flex>

            {generalProfile?.saedCourse ? (
                <VStack flexShrink={1}>
                    <Heading fontSize="sm" mt={5} mb={2}>
                        SAED Course
                    </Heading>
                    <Text fontSize="md" flexWrap="wrap">{generalProfile.saedCourse}</Text>
                </VStack>
            ) : null}

            <Flex
                direction="row"
                alignItems="center"
                justifyContent="space-between"
            >
                {generalProfile?.languages?.length ? (
                    <VStack flexShrink={1}>
                        <Heading fontSize="sm" mt={5} mb={2}>
                            Languages
                        </Heading>
                        <Text fontSize="md" flexWrap="wrap">
                            {generalProfile.languages.join(',')}
                        </Text>
                    </VStack>
                ) : null}
                {generalProfile?.height ? (
                    <VStack flexShrink={1}>
                        <Heading fontSize="sm" mt={5} mb={2}>
                            Height
                        </Heading>
                        <Text fontSize="md" flexWrap="wrap">{generalProfile.height}</Text>
                    </VStack>
                ) : null}
                {generalProfile?.shoeSize ? (
                    <VStack flexShrink={1}>
                        <Heading fontSize="sm" mt={5} mb={2}>
                            Shoe Size
                        </Heading>
                        <Text fontSize="md" flexWrap="wrap">{generalProfile.shoeSize}</Text>
                    </VStack>
                ) : null}
            </Flex>

            <Flex direction="row" justifyContent="space-between" mt={5}>
                <Heading fontSize="sm" mt={5} mb={2}>
                    Career
                </Heading>
                <Button
                    variant="link"
                    colorScheme="primary"
                    onPress={() =>
                        auth?.userId === userId
                            ? navigation.navigate('Career Profile', {})
                            : navigation.navigate('CareerPreview', { profile })
                    }
                >
                    See More
                </Button>
            </Flex>
            {careerProfile?.profile ? (
                <Text fontSize="md">{careerProfile.profile}</Text>
            ) : (
                <Text fontWeight="semibold" color="gray.500">
                    No Career Profile 💼
                </Text>
            )}
            <Flex direction="row" justifyContent="space-between" mt={5}>
                <Heading fontSize="sm" mt={5} mb={2}>
                    Relationship
                </Heading>
                <Button
                    variant="link"
                    colorScheme="primary"
                    onPress={() =>
                        auth?.userId === userId
                            ? navigation.navigate('Dating Profile', {})
                            : navigation.navigate('DatingPreview', { profile })
                    }
                >
                    See More
                </Button>
            </Flex>
            {datingProfile?.profile ? (
                <Text fontSize="md">{datingProfile.profile}</Text>
            ) : (
                <Text fontWeight="semibold" color="gray.500">
                    No Dating Profile Available ❤️
                </Text>
            )}

            <Modal visible={isOpen} transparent={true} animationType="slide">
                <Flex
                    bg="white"
                    marginTop="auto"
                    shadow="5"
                    borderRadius="2xl"
                    pb={10}
                    direction="column"
                    p={5}
                >
                    <Heading mb={5}>Select Avatar</Heading>
                    <Button
                        disabled={isUploadingFromLibrary || isLoadingFromCamera}
                        isLoading={isUploadingFromLibrary}
                        isLoadingText="Uploading Image"
                        size="lg"
                        onPress={pickImageFromGallery}
                    >
                        Pick From Gallery
                    </Button>
                    <Button
                        isLoading={isLoadingFromCamera}
                        isLoadingText="Uploading Image"
                        onPress={pickImageFromCamera}
                        disabled={isUploadingFromLibrary || isLoadingFromCamera}
                        size="lg"
                        my={3}
                    >
                        Pick From Camera
                    </Button>
                    <Button
                        disabled={isUploadingFromLibrary || isLoadingFromCamera}
                        size="lg"
                        variant="outline"
                        onPress={onClose}
                    >
                        Cancel
                    </Button>
                </Flex>
            </Modal>
            <Modal
                visible={reportViewOpen}
                transparent={true}
                animationType="slide"
            >
                <Flex
                    bg="white"
                    marginTop="auto"
                    shadow="7"
                    borderRadius="2xl"
                    pb={10}
                    direction="column"
                    p={5}
                >
                    <ProfileBlock
                        onCancel={onCloseReportView}
                        onBlockSuccess={onBlockSuccess}
                        userId={auth?.userId || ''}
                        user={profile}
                        onReport={() => {
                            onCloseReportView();
                            navigation.navigate('Report', {
                                user: profile,
                            });
                        }}
                    />
                </Flex>
            </Modal>
            <Modal visible={profilePreveiwOpen} animationType="fade">
                <Flex
                    flex={1}
                    position="relative"
                    alignItems="center"
                    justifyContent="center"
                    safeArea
                >
                    <IconButton
                        position="absolute"
                        top={8}
                        right={2}
                        size="sm"
                        alignSelf="flex-end"
                        icon={<CloseIcon />}
                        onPress={oncloseProfilePreview}
                    />
                    <Image
                        alt="avartar preview"
                        width={windowWidth}
                        height={(windowWidth * 3) / 4}
                        source={{ uri: profile?.profileUrl }}
                        fallbackSource={placeHolderImage}
                    />
                </Flex>
            </Modal>
            <Modal visible={photoPickerOpen} animationType="slide">
                <ImagePickCropper type={photoSelectMode} />
            </Modal>
        </Flex>
    );
};
