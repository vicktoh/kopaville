import { Button, Flex, Heading, Text, Box, HStack, IconButton, Icon, useDisclose, useToast } from 'native-base';
import React, { FC, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { ProfileSection } from './ProfileSection';
import { Profile } from '../types/Profile';
import { Modal, Pressable, View } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { DrawerParamList, HomeStackParamList } from '../types';
import * as ImagePicker from 'expo-image-picker';
import { updateProfileInfo, uploadProfilePicture } from '../services/profileServices';
import { setProfile } from '../reducers/profileSlice';
import { Follower, followUser, unfollowUser } from '../services/followershipServices';
import { setFollowership } from '../reducers/followershipSlice';
type GeneralProfileProps = {
    profile: Profile;
    onEdit?: () => void;
};

export const GeneralProfile: FC<GeneralProfileProps> = ({ profile, onEdit }) => {
    const {auth, profile: localProfile, followerships} = useAppSelector(({ auth, profile, followerships }) => ({auth, profile, followerships}));
    const { profile: generalProfile, careerProfile, datingProfile, userId } = profile;
    const [isUploadingFromLibrary, setUploadingFromLibrary] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { isOpen, onOpen, onClose } = useDisclose();
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<DrawerParamList& HomeStackParamList >>();
    const toast = useToast();
    const following = useMemo(
        () => (followerships?.following || []).filter(({ userId }) => userId == profile.userId),
        [profile]
    );
    const pickImageFromGallery = async () => {
        let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted === false) {
            return;
        }
        try {
            setUploadingFromLibrary(true);
            let pickerResult: any = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, base64: true });
            const url = await uploadProfilePicture(auth?.userId || '', pickerResult?.uri || '');
            updateProfileInfo(auth?.userId || "", { profileUrl: url});
            dispatch(setProfile({...profile, profileUrl: url}));
            
        } catch (error) {
            console.log({error})
        } finally {
            setUploadingFromLibrary(false);
            onClose();
        }
    };
    const follow = async () => {
        try {
            setLoading(true);
            const { userId = "", profileUrl = "", loginInfo: { username, fullname}} = profile;
            const follower: Follower = { userId, username, fullname, photoUrl: profileUrl};
            await followUser(auth?.userId || '', follower);
        } catch (error) {
            console.log(error);
            let err: any = error;
            toast.show({
                placement: 'top',
                title: 'error',
                description: err?.message || 'Could not follow user, Try again',
                status: "error"
            });
        } finally {
            setLoading(false);
        }
    };
    const unfollow = async () => {
        try{
            setLoading(true);
            await unfollowUser(auth?.userId || "", profile?.userId);
        }
        catch (error) {
            console.log(error);
            let err: any = error;
            toast.show({
                placement: 'top',
                title: 'error',
                description: err?.message || 'Could not follow user, Try again',
                status: "error"
            });
        } finally {
            setLoading(false);
        }

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
            <ProfileSection profile={profile} userId={auth?.userId || ''} promptAvatarChange={onOpen} />

            <HStack my={3} alignItems="center">
                {auth?.userId === userId ? (
                    <Button variant="outline" onPress={() => onEdit && onEdit()}>
                        Edit
                    </Button>
                ) : (
                    following.length ?
                    <Button variant="outline" isLoading = {loading} onPress={unfollow}>Unfollow</Button>:
                    <Button variant="solid" isLoading = {loading} onPress = {follow}>Follow</Button>
                )}
                {generalProfile?.instagram ? (
                    <IconButton
                        variant="ghost"
                        ml={5}
                        icon={<Icon as={AntDesign} name="instagram" color="primary.400" />}
                    />
                ) : null}
                {generalProfile?.twitter ? (
                    <IconButton
                        variant="ghost"
                        ml={3}
                        icon={<Icon as={Feather} name="twitter" color="primary.400" />}
                    />
                ) : null}
            </HStack>

            <Heading fontSize="sm" mt={5} mb={2}>
                Bio
            </Heading>
            <Text fontSize="md">
                {generalProfile?.bio ? generalProfile.bio : 'You do not have bio yet, edit your profile to get one'}
            </Text>

            <Flex direction="row" justifyContent="space-between" mt={5}>
                <Heading fontSize="sm" mt={5} mb={2}>
                    Career
                </Heading>
                <Button variant="link" colorScheme="primary" onPress={() => auth?.userId === userId ? navigation.navigate('Career Profile', {}): navigation.navigate("CareerPreview", { profile })}>
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
                <Button variant="link" colorScheme="primary" onPress={() => auth?.userId === userId ? navigation.navigate('Dating Profile', {}): navigation.navigate("DatingPreview", {profile})}>
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
                <Flex bg="white" marginTop="auto" shadow="5" borderRadius="2xl" pb={10} direction="column" p={5}>
                    <Heading mb={5}>Select Avatar</Heading>
                    <Button isLoading={isUploadingFromLibrary} isLoadingText="Uploadiing Image" size="lg" onPress={pickImageFromGallery}>
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
        </Flex>
    );
};
