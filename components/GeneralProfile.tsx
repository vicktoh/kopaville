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
import { Modal, Pressable, useWindowDimensions, View } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { DrawerParamList, HomeStackParamList } from '../types';
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
import { setFollowership } from '../reducers/followershipSlice';
import { differenceInCalendarYears } from 'date-fns';
import { useOpenLink } from '../hooks/useOpenLink';

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
    } = useAppSelector(({ auth, profile, followerships }) => ({
        auth,
        profile,
        followerships,
    }));
    const {
        profile: generalProfile,
        careerProfile,
        datingProfile,
        userId,
    } = profile;
    const [isUploadingFromLibrary, setUploadingFromLibrary] =
        useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { width: windowWidth } = useWindowDimensions();
    const { isOpen, onOpen, onClose } = useDisclose();
    const {
        isOpen: profilePreveiwOpen,
        onOpen: onOpenProfilePreview,
        onClose: oncloseProfilePreview,
    } = useDisclose();
    const dispatch = useAppDispatch();
    const navigation =
        useNavigation<NavigationProp<DrawerParamList & HomeStackParamList>>();
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
                ({ userId }) => userId == profile.userId
            ),
        [profile]
    );
    const { openLink } = useOpenLink();
    const pickImageFromGallery = async () => {
        let permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted === false) {
            return;
        }
        try {
            setUploadingFromLibrary(true);
            let pickerResult: any = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                base64: true,
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
        } catch (error) {
            let err: any = error;
            toast.show({
                placement: 'top',
                title: 'error',
                description: err?.message || 'Could not follow user, Try again',
                status: 'error',
            });
        } finally {
            setLoading(false);
        }
    };
    const unfollow = async () => {
        try {
            setLoading(true);
            await unfollowUser(auth?.userId || '', profile?.userId);
        } catch (error) {
            console.log(error);
            let err: any = error;
            toast.show({
                placement: 'top',
                title: 'error',
                description: err?.message || 'Could not follow user, Try again',
                status: 'error',
            });
        } finally {
            setLoading(false);
        }
    };
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
            <ProfileSection
                onOpenPreview={onOpenProfilePreview}
                profile={profile}
                userId={auth?.userId || ''}
                promptAvatarChange={onOpen}
            />

            <HStack my={3} alignItems="center">
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
                    <Text fontSize="md">{generalProfile.lga}</Text>
                </>
            ) : null}

            <Flex direction="row" mt={5} mb={2}>
                {generalProfile?.servingState ? (
                    <VStack>
                        <Heading fontSize="sm">Serving State</Heading>
                        <Text fontSize="md">{generalProfile.servingState}</Text>
                    </VStack>
                ) : null}
                {generalProfile?.servingLGA ? (
                    <VStack ml={generalProfile?.servingState ? 8 : 0}>
                        <Heading fontSize="sm">Serving L.G.A</Heading>
                        <Text fontSize="md">{generalProfile.servingLGA}</Text>
                    </VStack>
                ) : null}
            </Flex>
            {generalProfile?.ppa ? (
                <>
                    <Heading fontSize="sm" mt={5} mb={2}>
                        Place of Primary Assignment
                    </Heading>
                    <Text fontSize="md">{generalProfile.ppa}</Text>
                </>
            ) : null}

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
            <Heading fontSize="sm" mt={5} mb={2}>
                Posts
            </Heading>
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
                        isLoading={isUploadingFromLibrary}
                        isLoadingText="Uploadiing Image"
                        size="lg"
                        onPress={pickImageFromGallery}
                    >
                        Pick From Gallery
                    </Button>
                    <Button size="lg" my={3}>
                        Pick From Camera
                    </Button>
                    <Button size="lg" variant="outline" onPress={onClose}>
                        Cancel
                    </Button>
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
        </Flex>
    );
};
