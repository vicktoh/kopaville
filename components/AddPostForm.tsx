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
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';
import { Platform, useWindowDimensions } from 'react-native';
import { sendPost } from '../services/postsServices';
import { useAppSelector } from '../hooks/redux';
import { getUploadBlob } from '../services/profileServices';

type AddPostFormProps = {
    onClose: () => void;
};

export const AddPostForm: FC<AddPostFormProps> = ({ onClose }) => {
    const { auth, profile } = useAppSelector(({ auth, profile }) => ({
        auth,
        profile,
    }));
    const [postText, setPostText] = useState<string>('');
    const [imageUri, setImageUri] = useState<string[]>([]);
    const [blobs, setBlob] = useState<Blob[]>([]);
    const [videoBlob, setVideoBlob] = useState<Blob>();
    const [pickedVideo, setPickedVideo] =
        useState<ImagePicker.ImagePickerResult>();
    const [postFormError, setPostFormError] = useState<string>('');
    const [posting, setPosting] = useState<boolean>(false);
    const { width: windowWidth } = useWindowDimensions();
    const toast = useToast();

    const pickFromGallery = async () => {
        const { granted } = await MediaLibrary.requestPermissionsAsync();
        if(granted){
            const library = await MediaLibrary.getAssetsAsync();
            let uris = [];
            const currBlobs = [];
            for(let i = 0; i < library.assets.length; i++){
                const blob = await getUploadBlob(library.assets[i].uri);
                currBlobs.push(blob);
                uris.push(library.assets[i].uri);

            }
            setBlob([...(blobs || []), ...currBlobs]);
            setImageUri(uris);
        }
    };

    const pickVideoFromGallery = async () => {
        let permissin = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (permissin.granted === false && permissin.canAskAgain) {
            permissin = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissin.granted == false) {
                toast.show({
                    title: 'Permission Denied',
                    description:
                        'Please grant access to your gallery from your phone settings',
                    status: 'error',
                    placement: 'top',
                });
                return;
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            videoQuality: 2,
        });
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
        var permission = await ImagePicker.getCameraPermissionsAsync();
        if (permission.granted === false && permission.canAskAgain) {
            permission = await ImagePicker.requestCameraPermissionsAsync();

            if (permission.granted === false) {
                toast.show({
                    title: 'Unable to complete, Camera permission required',
                    status: 'error',
                    description: '',
                });
            }
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.1,
            base64: true,
            allowsMultipleSelection: false,
        });

        if (Platform.OS === 'android') {
            // const androidResults = await ImagePicker.getPendingResultAsync();
            // console.log(androidResults);
            // console.log('result', result);
            return;
            // const blob = await getUploadBlob(result.uri);
            // setBlob([...(blobs || []), blob]);
            // setImageUri((images) => [...images, result.uri]);
        } else {
            if (result.cancelled) {
                return;
            }
            const blob = await getUploadBlob(result.uri);
            setBlob([...(blobs || []), blob]);
            setImageUri((images) => [...images, result.uri]);
        }
        // setImageUri((images) => [...images, result.uri]);
    };

    const makePost = async () => {
        if (!postText && !imageUri.length) {
            setPostFormError('Text or Image must be selected to make a post');
            return;
        }
        try {
            setPosting(true);
            const mediaType = videoBlob
                ? 'Video'
                : blobs.length
                ? 'Image'
                : 'None';
            await sendPost({
                ...(postText ? { text: postText } : {}),
                ...(blobs ? { blobs } : {}),
                ...(videoBlob ? { videoBlob } : {}),
                mediaType,
                userId: auth?.userId || '',
                avartar: {
                    photoUrl: profile?.profileUrl || '',
                    username: profile?.loginInfo?.username || '',
                },
            });
            onClose();
        } catch (error) {
            toast.show({
                title: 'Could not add post',
                description:
                    'An error occured try again, Check that your internet connection is strong',
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
                <FormControl.ErrorMessage>
                    {postFormError}
                </FormControl.ErrorMessage>
            </FormControl>
            <HStack space={3} my={3}>
                {imageUri.length < 4 && !!!pickedVideo ? (
                    <>
                        <Button
                            onPress={() => pickFromGallery()}
                            key={'gallery'}
                            bg="secondary.400"
                            size="xs"
                            leftIcon={
                                <Icon size="xs" as={Entypo} name="image" />
                            }
                        >
                            Add Image
                        </Button>
                        <Button
                            key={'camera'}
                            onPress={pickImageFromCamera}
                            bg="secondary.400"
                            size="xs"
                            leftIcon={
                                <Icon size="xs" as={Entypo} name="camera" />
                            }
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
                        leftIcon={
                            <Icon size="xs" as={Entypo} name="video-camera" />
                        }
                    >
                        Add Video
                    </Button>
                ) : null}
            </HStack>

            <ScrollView horizontal={true}>
                <HStack space={5}>
                    {imageUri && imageUri.length
                        ? imageUri.map((uri, i) => (
                              <Flex
                                  direction="column"
                                  key={`image-preview-${i}`}
                              >
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
                                      icon={
                                          <Icon
                                              size="sm"
                                              as={Entypo}
                                              name="cross"
                                          />
                                      }
                                  />
                                  <Image
                                      width={70}
                                      height={(70 * 5) / 4}
                                      alt="Image post"
                                      source={{ uri }}
                                  />
                              </Flex>
                          ))
                        : null}
                    {pickedVideo && !pickedVideo.cancelled ? (
                        <Box>
                            <Video
                                style={{ width: 70, height: (70 * 5) / 4 }}
                                source={{ uri: pickedVideo.uri }}
                            />
                            <Text fontSize="xs" my={1}>{`Video (${
                                pickedVideo?.duration || 0 / 100
                            })s`}</Text>
                            <Button
                                onPress={removeVideo}
                                size="xs"
                                variant="solid"
                                colorScheme="error"
                            >
                                remove
                            </Button>
                        </Box>
                    ) : null}
                </HStack>
            </ScrollView>
            <Button
                onPress={onClose}
                variant="outline"
                disabled={posting}
                size="lg"
                mt={5}
            >
                Cancel
            </Button>
            <Button
                isLoading={posting}
                isLoadingText="Please Wait"
                my={3}
                size="lg"
                onPress={makePost}
            >
                Post
            </Button>
        </Flex>
    );
};
