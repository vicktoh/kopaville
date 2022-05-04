import React, { FC, useState } from 'react';
import {
    Box,
    Button,
    Flex,
    FormControl,
    TextArea,
    Image,
    IconButton,
    Icon,
    HStack,
    useToast,
    ScrollView,
    Text,
} from 'native-base';
import { AntDesign, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { useWindowDimensions } from 'react-native';
import { sendPost } from '../services/postsServices';
import { useAppSelector } from '../hooks/redux';
import { getUploadBlob } from '../services/profileServices';

type AddPostFormProps = {
    onClose: () => void;
};

export const AddPostForm: FC<AddPostFormProps> = ({ onClose }) => {
    const {auth, profile} = useAppSelector(({ auth, profile }) => ({auth, profile}));
    const [postText, setPostText] = useState<string>('');
    const [imageUri, setImageUri] = useState<string[]>([]);
    const [blobs, setBlob] = useState<Blob[]>([]);
    const [videoBlob, setVideoBlob] = useState<Blob>();
    const [pickedVideo, setPickedVideo] = useState<ImagePicker.ImagePickerResult>();
    const [videoThumbnail, setVideoThumbnail] = useState<string>('');
    const [postFormError, setPostFormError] = useState<string>('');
    const [posting, setPosting] = useState<boolean>(false);
    const { width: windowWidth } = useWindowDimensions();
    const toast = useToast();

    const pickFromGallery = async () => {
        const permissin = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (permissin.granted === false) {
            toast.show({
                title: 'Permission Denied',
                description: 'Please grant access to your camera from your phone settings',
                status: 'error',
            });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({ base64: true, aspect: [4, 5], quality: 0.2 });
        if (result.cancelled) {
            return;
        }
        
        const blob = await getUploadBlob(result.uri);
        setBlob([...(blobs || []), blob]);
        setImageUri((images) => [...images, result.uri]);
    };

    const pickVideoFromGallery = async () => {
        const permissin = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (permissin.granted === false) {
            toast.show({
                title: 'Permission Denied',
                description: 'Please grant access to your camera from your phone settings',
                status: 'error',
                placement: 'top',
            });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Videos, videoQuality: 2 });
        if (result.cancelled) {
            return;
        }
        try {
        const blob = await getUploadBlob(result.uri);
        setPickedVideo(result);
        setVideoBlob(blob);
        } catch (error) {
            console.log(error);
        }
        
    };

    const pickImageFromCamera = async () => {
        const permissin = await ImagePicker.getCameraPermissionsAsync();
        if (permissin.granted === false) {
            toast.show({
                title: 'Permission Denied',
                description: 'Please grant access to your camera from your phone settings',
                status: 'error',
                placement: 'top',
            });

            return;
        }

        const result = await ImagePicker.launchCameraAsync({ base64: true, aspect: [4, 5], quality: .2 });
        if (result.cancelled) {
            return;
        }
        setImageUri((images) => [...images, result.uri]);
    };

    const makePost = async () => {
        if (!postText && !imageUri.length) {
            setPostFormError('Text or Image must be selected to make a post');
            return;
        }
        try {
            setPosting(true);
            const mediaType = videoBlob ? 'Video' : blobs.length ? 'Image' : 'None';
            await sendPost({
                ...(postText ? { text: postText } : {}),
                ...(blobs ? { blobs } : {}),
                ...(videoBlob ? { videoBlob } : {}),
                mediaType,
                userId: auth?.userId || '',
                avartar: {
                    photoUrl: profile?.profileUrl || "",
                    username: profile?.loginInfo?.username || ""
                }
            });
            onClose();
        } catch (error) {
            console.log(error);
            toast.show({
                title: 'Could not add post',
                description: 'An error occured try again, Check that your internet connection is strong',
                placement: 'top',
                zIndex: 7,
            });
        } finally {
            setPosting(false);
        }
    };
    const removeImagePreview = (i: number) => {
        const newimages = [...imageUri];
        const newblobs = [...blobs];
        newimages.splice(i, 1);
        newblobs.splice(i, 1);
        setImageUri(newimages);
        setBlob(newblobs);
    };

    const removeVideo = () => {
        setPickedVideo(undefined);
        setVideoBlob(undefined);
    };

    return (
        <Flex direction="column">
            <FormControl my={3} isInvalid={!!postFormError}>
                <TextArea
                    borderColor="primary.400"
                    value={postText}
                    height={20}
                    placeholder="What's on your mind"
                    onChangeText={(text) => setPostText(text)}
                />
                <FormControl.ErrorMessage>{postFormError}</FormControl.ErrorMessage>
            </FormControl>
            <HStack space={3} my={3}>
                {imageUri.length < 4 && !!!pickedVideo ? (
                    <>
                        <Button
                            onPress={() => pickFromGallery()}
                            key={'gallery'}
                            bg="secondary.400"
                            size="xs"
                            leftIcon={<Icon size="xs" as={Entypo} name="image" />}
                        >
                            Add Image
                        </Button>
                        <Button
                            key={'camera'}
                            onPress={pickImageFromCamera}
                            bg="secondary.400"
                            size="xs"
                            leftIcon={<Icon size="xs" as={Entypo} name="camera" />}
                        >
                            Add Image
                        </Button>
                    </>
                ) : null}
                {!imageUri.length && !pickedVideo ? (
                    <Button
                        onPress={() => pickVideoFromGallery()}
                        bg="secondary.400"
                        size="xs"
                        leftIcon={<Icon size="xs" as={Entypo} name="video-camera" />}
                    >
                        Add Video
                    </Button>
                ) : null}
            </HStack>

            <ScrollView horizontal={true}>
                <HStack space={5}>
                    {imageUri && imageUri.length
                        ? imageUri.map((uri, i) => (
                              <Flex direction="column" key={`image-preview-${i}`}>
                                  <IconButton
                                      onPress={() => removeImagePreview(i)}
                                      alignSelf="flex-end"
                                      size="sm"
                                      mr={-3}
                                      mb={-2}
                                      bottom="0"
                                      left="0"
                                      bg="secondary.300"
                                      zIndex={5}
                                      icon={<Icon size="sm" as={Entypo} name="cross" />}
                                  />
                                  <Image width={70} height={(70 * 5) / 4} alt="Image post" source={{ uri }} />
                              </Flex>
                          ))
                        : null}
                    {pickedVideo && !pickedVideo.cancelled ? (
                        <Box>
                            <Video  style = {{width: 70, height: (70*5)/4}} source={{uri: pickedVideo.uri}} />
                            <Text fontSize="xs" my={1}>{`Video (${pickedVideo?.duration || 0/100})s`}</Text>
                            <Button onPress={removeVideo} size="xs" variant="solid" colorScheme="error">remove</Button>
                        </Box>
                    ) : null}
                </HStack>
            </ScrollView>
            <Button onPress={onClose} variant="outline" disabled={posting} size="lg" mt={5}>
                Cancel
            </Button>
            <Button isLoading={posting} isLoadingText="Please Wait" my={3} size="lg" onPress={makePost}>
                Post
            </Button>
        </Flex>
    );
};
