import { AntDesign, Entypo } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Video } from 'expo-av';
import { CameraCapturedPicture } from 'expo-camera';
import { Asset, MediaType } from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
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
    ScrollView,
} from 'native-base';
import React, { useMemo } from 'react';
import { FC } from 'react';
import { useState } from 'react';
import { Modal, Platform, useWindowDimensions } from 'react-native';
import { GalleryPicker } from '../components/GalleryPicker';
import KruiseCamera from '../components/KruiseCamera';
import { useAppSelector } from '../hooks/redux';
import { secondsTotime } from '../services/helpers';
import { editPost, removeUploadedPic, sendPost } from '../services/postsServices';
import { getUploadBlob } from '../services/profileServices';
import { HomeStackParamList } from '../types';
import * as  MediaLibrary from "expo-media-library"
import { useEffect } from 'react';
import { MAX_POST_PHOTO } from '../constants/files';
import { Post } from '../types/Post';
import { LoadingScreen } from './LoadingScreen';
type PostComponentProps = {
    onRemove: () => void;
    asset: ImagePicker.ImageInfo
    type: 'ios'
}| { onRemove: ()=> void; asset: Asset; type: 'android'};
const POSTIMAGE_WIDTH = 100;
const PostComponent: FC<PostComponentProps> = ({ onRemove, asset, type }) => {
    const componenttype = type === "android" ? asset.mediaType : asset.type
    const isImage = type === "android" ? componenttype === "photo" : componenttype === "image"
    // const [localUri, setUri] = useState<string>('');

    // useEffect(() => {
    //     const fetchAssetInfo = async () => {
    //         if (localUri) return;
    //         let assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
    //         setUri(assetInfo.localUri || assetInfo.uri);
    //     };
    //     fetchAssetInfo();
    // }, []);
    return (
        <Flex
            direction="column"
            width={POSTIMAGE_WIDTH}
            height={(4 / 3) * POSTIMAGE_WIDTH}
            position="relative"
            mt={1}
        >
            {isImage ? (
                <Image alt="upload photo" src={asset.uri} flex={1} />
            ) : (
                <Video source={{ uri: asset.uri }} style={{ flex: 1 }} />
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
            {componenttype === 'video' && asset.duration ? (
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
    'Edit Post'
>;

export const EditPostScreen: FC<NewPostScreenProps> = ({ navigation, route }) => {
   const { post } = route.params || {};
   const {auth, profile} = useAppSelector(({auth, profile})=> ({auth, profile}));
   const { height: windowHeight } = useWindowDimensions();
   const [posting, setPosting] = useState<boolean>(false);
    const [postText, setPostText] = useState<string>(post.text || '');
    const [postFormError, setPostFormError] = useState<string>();
    const [imageAssets, setImageAssets] = useState<Asset[]>([]);
    const [imagesInfo, setImagesInfo] = useState<ImagePicker.ImageInfo[]>([])
    const [existingImages, setExistingImages] = useState<Post["imageUrl"]>(post.imageUrl);
    const [existingVideo, setExistingVideo] = useState<Post["videoUrl"]>(post.videoUrl);
    const [removedIndexes, setRemovedIndexes] = useState<string[]>([]);
    const [videoAsset, setVideoAsset] = useState<Asset>();
    const [videoInfo, setVideoInfo] = useState<ImagePicker.ImageInfo>();
    
    // const [videoBlob, setVideoBlob] = useState<Blob>();
    const [uploadType, setUploadType] = useState<'photo' | 'video'>('photo');
    const { isOpen, onClose, onOpen } = useDisclose();
    const isAndroid = Platform.OS === "android";
    const {
        isOpen: isCameraModalOpen,
        onClose: onCloseCameraModal,
        onOpen: onOpenCameraModal,
    } = useDisclose();
    const toast = useToast();
    const onSelectImage = async (assets:  Asset[]) => {
        const currBlobs: Blob[] = [];
        for (let i = 0; i < assets.length; i++) {
            const blob = await getUploadBlob(assets[i].uri);
            currBlobs.push(blob);
        }
        setImageAssets(assets);
        // setImageBlobs(currBlobs);
        onClose();
    };
    const getImagesBlob = async (assets: (Asset | ImagePicker.ImageInfo) []) => {
        const currBlobs: Blob[] = [];
        for (let i = 0; i < assets.length; i++) {
            const blob = await getUploadBlob(assets[i].uri);
            currBlobs.push(blob);
        }

        return currBlobs;
        // setImageBlobs(currBlobs);
    }

    const selectCameraImage = async({width, height, uri, base64 }: CameraCapturedPicture) =>{
      if(imageAssets.length > MAX_POST_PHOTO) return;
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
        // setVideoBlob(videoBlob);
        setVideoAsset(asset[0]);
        onClose();
    };
    const onOpenPicker = async (type: 'photo' | 'video') => {
        setUploadType(type);
        onOpen();
    };
    const onRemoveAsset = (index: number) => {
        const copyImagesInfo = [...(isAndroid ? imageAssets : imagesInfo)];
        copyImagesInfo.splice(index, 1);
        isAndroid ? setImageAssets(copyImagesInfo as any) : setImagesInfo(copyImagesInfo as any);
    };
    const editUserPost = async () => {
      const selectedImages = isAndroid  ? imageAssets : imagesInfo;
      if (!postText && !selectedImages.length && !videoInfo && !existingVideo && !existingImages?.length) {
          setPostFormError('Text, Image or Video must be selected to make a post');
          return;
      }
      try {
          setPosting(true);
          const mediaType = videoInfo
              ? 'Video'
              : selectedImages?.length
              ? 'Image'
              : 'None';
          let imageBlobs: Blob[]| undefined  = undefined;
          let videoBlob: Blob | undefined = undefined;
          if(mediaType === "Video" && videoInfo){
             videoBlob = await getUploadBlob(videoInfo.uri);
          }
          if(mediaType == "Image" && selectedImages.length){
            imageBlobs = await getImagesBlob(selectedImages)
          }
          await editPost({
              ...(postText ? { text: postText } : {}),
              ...(imageBlobs ? { blobs: imageBlobs } : {}),
              ...(videoBlob ? { videoBlob } : {}),
              mediaType,
              userId: auth?.userId || '',
              avartar: {
                  photoUrl: profile?.profileUrl || '',
                  username: profile?.loginInfo?.username || '',
              }
          }, 
          {
           postId: post.postId,
           imageUrl: existingImages,
           videoUrl: existingVideo
          }, removedIndexes);
          navigation.goBack();
      } catch (error) {
          toast.show({
              title: 'Could not edit post',
              description:
                  'An error occured try again, Check that your internet connection is strong',
              placement: 'top',
              zIndex: 7,
          });
      } finally {
          setPosting(false);
      }
  };

  const _uploadImagesFromCamera = async ()=> {
    try {
        const pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.2
        });
        if(pickerResult.cancelled === false){
            if(imagesInfo.length >= MAX_POST_PHOTO) throw new Error("Cannot select more thatn 4 pictures");
            setImagesInfo([...imagesInfo, pickerResult]);
        } 
    } catch (error) {
        const err: any = error;
        toast.show({
            title: "Could not take picture",
            description: err?.message || "Unknown error, Please try again",
        });
    }
    

  }
  const _uploadImagesFromGallery = async()=> {
    try {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(permission.granted === false) throw new Error("Did");
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            aspect: [4, 3],
            quality: 0.2,
            allowsMultipleSelection: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        if(pickerResult.cancelled === false){
            if(pickerResult.cancelled !== false){
                return;
            }
            const totalImages = pickerResult.selected.length + (imagesInfo?.length || 0)
            if(totalImages > MAX_POST_PHOTO){
                throw new Error("Cannot select more than 4 pictures");
                return;
            }
            setImagesInfo([...(imagesInfo || []), ...pickerResult.selected]);
            
            
        }
        
    } catch (error) {
        const err: any = error;
        toast.show({
            title: "Could not select images",
            description: err?.message || "Unknown error"
        })
    }
  }

  const _pickVideoFromGallery = async()=> {
      try {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(permission.granted === false) throw new Error("Did");
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            aspect: [4, 3],
            quality: 0.2,
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        });

        if(pickerResult.cancelled === false){
            setVideoInfo(pickerResult);
        }
      } catch (error) {
        
      }
  }
  const onRemoveExistingImages = async (index: number, storageKey: string) => {
    const copyExistingImages =  [...(existingImages || []) ]
    copyExistingImages.splice(index, 1);
    setExistingImages(copyExistingImages);
    setRemovedIndexes([...removedIndexes, storageKey])

  }
  if(posting) {
    return <LoadingScreen label='Updating...' />
  }
    return (
        <ScrollView flex={1} bg="white">
            <Flex
                safeArea
                bg="white"
                px={3}
                flex={1}
                minHeight={windowHeight - 50}
            >
                <IconButton
                    disabled={posting}
                    alignSelf="flex-start"
                    size="md"
                    icon={<ArrowBackIcon />}
                    onPress={() => navigation.goBack()}
                />
                <Heading>Edit Post</Heading>
                <FormControl my={3} isInvalid={!!postFormError}>
                    <TextArea
                        autoCompleteType=""
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
                    {!(videoInfo || existingVideo) ? (
                        <>
                            <Button
                                onPress={
                                    Platform.OS === 'android'
                                        ? () => onOpenPicker('photo')
                                        : _uploadImagesFromGallery
                                }
                                key={'gallery'}
                                bg="secondary.400"
                                _text={{ color: 'black' }}
                                size="xs"
                                leftIcon={
                                    <Icon
                                        color="black"
                                        size="xs"
                                        as={Entypo}
                                        name="image"
                                    />
                                }
                            >
                                Add Image
                            </Button>
                            <Button
                                onPress={
                                    isAndroid
                                        ? onOpenCameraModal
                                        : _uploadImagesFromCamera
                                }
                                key={'camera'}
                                bg="secondary.400"
                                _text={{ color: 'black' }}
                                size="xs"
                                leftIcon={
                                    <Icon
                                        color="black"
                                        size="xs"
                                        as={Entypo}
                                        name="camera"
                                    />
                                }
                            >
                                Add From Camera
                            </Button>
                        </>
                    ) : null}

                    {!(imageAssets.length  ||
                        (imagesInfo?.length || existingImages?.length)) &&
                    !(videoInfo 
                     || existingVideo) ? (
                        <Button
                            onPress={_pickVideoFromGallery}
                            bg="secondary.400"
                            _text={{ color: 'black' }}
                            size="xs"
                            leftIcon={
                                <Icon
                                    color="black"
                                    size="xs"
                                    as={Entypo}
                                    name="video"
                                />
                            }
                        >
                            Add Video
                        </Button>
                    ) : null}
                </Flex>
                <HStack space={3} flexWrap="wrap" mt={5}>
                {existingImages?.length
                        ? existingImages.map((image, i) => (
                              <PostComponent
                                  key={`existing/${ typeof image === 'string' ? image : image.url }`}
                                  asset={{ uri: typeof image === 'string' ? image: image.url , type: isAndroid ? 'photo' : 'image' } as any}
                                  type={isAndroid ? 'android' : 'ios'}
                                  onRemove={() => onRemoveExistingImages(i, image.storageKey)}
                              />
                          ))
                        : null}
                    {(isAndroid ? imageAssets : imagesInfo)?.length
                        ? (isAndroid ? imageAssets : imagesInfo).map(
                              (asset, i) => (
                                  <PostComponent
                                      asset={asset as any}
                                      type={isAndroid ? 'android' : 'ios'}
                                      key={`upload-post-${i}`}
                                      onRemove={() => onRemoveAsset(i)}
                                  />
                              )
                          )
                        : null}
                    
                    {videoInfo ? (
                        <PostComponent
                            asset={videoInfo as any}
                            onRemove={() => setVideoInfo(undefined)}
                            type={isAndroid ? 'android' : 'ios'}
                        />
                    ) : null}
                    {existingVideo ? (
                        <PostComponent
                            asset={
                                {
                                    uri: existingVideo,
                                    type: 'video',
                                    mediaType: 'video',
                                    
                                } as any
                            }
                            onRemove={() => setExistingVideo(undefined)}
                            type={isAndroid ? 'android' : 'ios'}
                        />
                    ) : null}
                </HStack>
                <Modal
                    visible={isOpen}
                    transparent={true}
                    animationType="slide"
                >
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

                        <KruiseCamera
                            onConfirmCapturedImage={selectCameraImage}
                        />
                    </Flex>
                </Modal>
                <Button
                    onPress={editUserPost}
                    isLoading={posting}
                    isLoadingText={'Please wait'}
                    size="lg"
                    disabled={
                        !!!postText &&
                        !!!videoInfo &&
                        !!!imagesInfo?.length &&
                        !!!imageAssets?.length
                    }
                    mb={5}
                    mt="auto"
                >
                    Edit Post
                </Button>
            </Flex>
        </ScrollView>
    );
};
