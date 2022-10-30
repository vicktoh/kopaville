import { AntDesign, Entypo } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Video } from 'expo-av';
import { CameraCapturedPicture } from 'expo-camera';
import { Asset, MediaType } from 'expo-media-library';
import {
    ArrowBackIcon,
    Button,
    Image,
    Flex,
    FormControl,
    Heading,
    Icon,
    IconButton,
    TextArea,
    useDisclose,
    useToast,
    Text,
    HStack,
} from 'native-base';
import React from 'react';
import { FC } from 'react';
import { useState } from 'react';
import { Modal } from 'react-native';
import { GalleryPicker } from '../components/GalleryPicker';
import KruiseCamera from '../components/KruiseCamera';
import { useAppSelector } from '../hooks/redux';
import { secondsTotime } from '../services/helpers';
import { sendPost } from '../services/postsServices';
import { getUploadBlob } from '../services/profileServices';
import { HomeStackParamList } from '../types';
import * as  MediaLibrary from "expo-media-library"
import { useEffect } from 'react';
type PostComponentProps = {
    onRemove: () => void;
    asset: Asset;
};
const POSTIMAGE_WIDTH = 100;
const PostComponent: FC<PostComponentProps> = ({ onRemove, asset }) => {
    const [localUri, setUri] = useState<string>('');

    useEffect(() => {
        const fetchAssetInfo = async () => {
            if (localUri) return;
            let assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
            setUri(assetInfo.localUri || assetInfo.uri);
        };
        fetchAssetInfo();
    }, []);
    return (
        <Flex
            direction="column"
            width={POSTIMAGE_WIDTH}
            height={(4 / 3) * POSTIMAGE_WIDTH}
            position="relative"
            mt={1}
        >
            {asset.mediaType === 'photo' ? (
                <Image alt="upload photo" src={asset.uri} flex={1} />
            ) : (
                <Video source={{ uri: localUri }} style={{ flex: 1 }} />
            )}
            <IconButton
                variant="solid"
                size={7}
                onPress={onRemove}
                icon={<Icon size={7} as={AntDesign} name="closecircleo" />}
                position="absolute"
                top={-1}
                right={-1}
            />
            {asset.mediaType == 'video' && asset.duration ? (
                <Text
                    fontSize="sm"
                    position="absolute"
                    bottom={1}
                    right={1}
                    color="white"
                >
                    {secondsTotime(asset.duration)}
                </Text>
            ) : null}
        </Flex>
    );
};
type NewPostScreenProps = NativeStackScreenProps<
    HomeStackParamList,
    'New Post'
>;

export const NewPost: FC<NewPostScreenProps> = ({ navigation }) => {
   const {auth, profile} = useAppSelector(({auth, profile})=> ({auth, profile}));
   const [posting, setPosting] = useState<boolean>(false);
    const [postText, setPostText] = useState<string>('');
    const [postFormError, setPostFormError] = useState<string>();
    const [imageAssets, setImageAssets] = useState<Asset[]>([]);
    const [imageBlobs, setImageBlobs] = useState<Blob[]>([]);
    const [videoAsset, setVideoAsset] = useState<Asset>();
    const [videoBlob, setVideoBlob] = useState<Blob>();
    const [uploadType, setUploadType] = useState<'photo' | 'video'>('photo');
    const { isOpen, onClose, onOpen } = useDisclose();
    const {
        isOpen: isCameraModalOpen,
        onClose: onCloseCameraModal,
        onOpen: onOpenCameraModal,
    } = useDisclose();
    const toast = useToast();
    const onSelectImage = async (assets: Asset[]) => {
        const currBlobs: Blob[] = [];
        for (let i = 0; i < assets.length; i++) {
            const blob = await getUploadBlob(assets[i].uri);
            currBlobs.push(blob);
        }
        setImageAssets(assets);
        setImageBlobs(currBlobs);
        onClose();
    };

    const selectCameraImage = async({width, height, uri, base64 }: CameraCapturedPicture) =>{
      if(imageAssets.length > 3) return;
      const timestamp = new Date().getTime();
      const newasset : Asset = {
         uri,
         width,
         height,
         id: 'camera-photo',
         mediaType: MediaType.photo,
         albumId: '',
         filename: '',
         creationTime: timestamp,
         modificationTime: timestamp,
         duration: 0
      }
      setImageAssets((assets) => [...assets, newasset]);
      onCloseCameraModal();
    }
    const onSelectVideo = async (asset: Asset[]) => {
        if (!asset.length) return;
        const videoBlob = await getUploadBlob(asset[0].uri);
        setVideoBlob(videoBlob);
        setVideoAsset(asset[0]);
        onClose();
    };
    const onOpenPicker = async (type: 'photo' | 'video') => {
        setUploadType(type);
        onOpen();
    };
    const onRemoveAsset = (index: number) => {
        const copyImageAssets = [...imageAssets];
        copyImageAssets.splice(index, 1);
        setImageAssets(copyImageAssets);
    };
    const makePost = async () => {
      if (!postText && !imageAssets.length && !videoAsset) {
          setPostFormError('Text or Image must be selected to make a post');
          return;
      }
      try {
          setPosting(true);
          const mediaType = videoBlob
              ? 'Video'
              : imageBlobs.length
              ? 'Image'
              : 'None';
          await sendPost({
              ...(postText ? { text: postText } : {}),
              ...(imageBlobs ? { blobs: imageBlobs } : {}),
              ...(videoBlob ? { videoBlob } : {}),
              mediaType,
              userId: auth?.userId || '',
              avartar: {
                  photoUrl: profile?.profileUrl || '',
                  username: profile?.loginInfo?.username || '',
              },
          });
          navigation.goBack();
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
    return (
        <Flex safeArea bg="white" px={3} flex={1}>
            <IconButton
                disabled={posting}
                alignSelf="flex-start"
                size="md"
                icon={<ArrowBackIcon />}
                onPress={() => navigation.goBack()}
            />
            <Heading>New Post</Heading>
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
            <Flex direction="row" justifyContent="space-around">
                {!videoAsset ? (
                    <>
                        <Button
                            onPress={() => onOpenPicker('photo')}
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
                            onPress={onOpenCameraModal}
                            key={'camera'}
                            bg="secondary.400"
                            size="xs"
                            leftIcon={
                                <Icon size="xs" as={Entypo} name="camera" />
                            }
                        >
                            Add From Camera
                        </Button>
                    </>
                ) : null}

                {!imageAssets.length && !videoAsset ? (
                    <Button
                        onPress={() => onOpenPicker('video')}
                        bg="secondary.400"
                        size="xs"
                        leftIcon={<Icon size="xs" as={Entypo} name="video" />}
                    >
                        Add Video
                    </Button>
                ) : null}
            </Flex>
            <HStack space={3} flexWrap="wrap" mt={5}>
                {imageAssets.length && imageAssets.length<=3
                    ? imageAssets.map((asset, i) => (
                          <PostComponent
                              asset={asset}
                              key={`upload-post-${asset.id}-${i}`}
                              onRemove={() => onRemoveAsset(i)}
                          />
                      ))
                    : null}
                {videoAsset ? (
                    <PostComponent
                        asset={videoAsset}
                        onRemove={() => setVideoAsset(undefined)}
                    />
                ) : null}
            </HStack>
            <Modal visible={isOpen} transparent={true} animationType="slide">
                <Flex flex={1} bg="white" safeArea>
                    <IconButton
                        size="sm"
                        icon={<Icon as={AntDesign} name="closecircleo" />}
                        alignSelf="flex-end"
                        mb={3}
                        onPress={onClose}
                    />
                    <GalleryPicker
                        mediaType={uploadType}
                        selectMultiple={uploadType === 'photo'}
                        initialAssets={imageAssets}
                        max={3}
                        onSelectComplete={
                            uploadType == 'photo'
                                ? onSelectImage
                                : onSelectVideo
                        }
                    />
                </Flex>
            </Modal>
            <Modal
                visible={isCameraModalOpen}
                transparent={false}
                animationType="slide"
            >
              <Flex flex={1} safeArea>

               <IconButton
                        
                        size="sm"
                        icon={<Icon as={AntDesign} name="closecircleo" />}
                        alignSelf="flex-end"
                        mb={3}
                        onPress={onCloseCameraModal}
                        />

                <KruiseCamera onConfirmCapturedImage={selectCameraImage} />
            </Flex>
            </Modal>
            <Button onPress={makePost} isLoading={posting} isLoadingText={"Please wait"} size="lg" disabled={!!!postText && !!!videoAsset && !!!imageAssets.length} mb={5} mt="auto">Post</Button>
        </Flex>
    );
};
