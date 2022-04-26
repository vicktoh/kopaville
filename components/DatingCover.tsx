import React, { FC, useState } from 'react';
import { ActivityIndicator, useWindowDimensions } from 'react-native';
import {
    Button,
    Flex,
    HStack,
    Icon,
    IconButton,
    Image,
    Menu,
    Popover,
    Text,
} from 'native-base';
import { AntDesign, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAppSelector } from '../hooks/redux';
import { updateProfileInfo, uploadFileToFirestore } from '../services/profileServices';
import { useDispatch } from 'react-redux';
import { setProfile } from '../reducers/profileSlice';

const datingCover = require('../assets/images/datingcover1.jpg');

type DatingCoverProps = {
    imageUri: string;
    index: number;
};

export const DatingCover: FC<DatingCoverProps> = ({
    imageUri,
    index,
}) => {
    const [replaceUri, setReplaceUri] = useState<string>();
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const { profile, auth } = useAppSelector(({profile, auth}) => ({ profile, auth }))
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const dispatch = useDispatch();
    const covers = profile?.datingProfile?.covers || [];


    const _uploadImage = async (uri: string) => {
        setIsUploading(true);
        const coverpath = `dating_covers/${auth?.userId}-${index}`;
        const newProfile = { ...(profile || {}) };
        const result = await uploadFileToFirestore(coverpath, uri);
        const newCovers = [...covers]
        newCovers[index] = result.url;
        dispatch(
            setProfile({
                ...newProfile,
                datingProfile: { ...(profile?.datingProfile || {}), covers: newCovers },
            })
        );
        updateProfileInfo(auth?.userId || '', {
            datingProfile: { ...profile?.datingProfile, covers: newCovers },
        });
        setIsUploading(false);
    };
    const pickImageFromGallery = async () => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            aspect: [3, 1],
            quality: 0.2,
            allowsEditing: true,
        });
        if (!pickerResult.cancelled) {
            setReplaceUri(pickerResult.uri);
            await _uploadImage(pickerResult.uri)
        }
    };

    const pickImageFromCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            return;
        }
        const pickerResult = await ImagePicker.launchCameraAsync({
            aspect: [3, 1],
            quality: 0.2,
            allowsEditing: true,
        });
        if (!pickerResult.cancelled) {
            setReplaceUri(pickerResult.uri);
            await _uploadImage(pickerResult.uri);
        }
    };
    return (
        <Flex
            
            width={windowWidth}
           position = "relative"
        >
            <Image
                width={windowWidth}
                height={windowHeight * 0.4}
                borderRadius="2xl"
                source={{ uri: replaceUri || imageUri }}
                fallbackSource={datingCover}
                alt = "cover image"
            />
            <Flex position="absolute"  direction="row" justifyContent="flex-end" >
            <Menu
             
                trigger={(triggerProps) => (
                    <IconButton
                        icon={<Icon color="white" as={Feather} name="more-vertical" />}
                        {...triggerProps}
                        bg="rgba(0, 0, 0, 0.5)"
                        
                    />
                )}
                
            >
                <Menu.Item onPress={pickImageFromGallery}>
                    <HStack alignItems="center" space={2}>
                        <Icon as={Feather} name="camera" />
                        <Text>Replace from gallery</Text>
                    </HStack>
                </Menu.Item>
                <Menu.Item onPress={pickImageFromCamera}>
                    <HStack alignItems="center" space={2}>
                        <Icon as={Feather} name="image" />
                        <Text>Replace from camera</Text>
                    </HStack>
                </Menu.Item>
            </Menu>
            </Flex>
            
           
            {isUploading ? (
                <Flex
                    position="absolute"
                    width={windowWidth}
                    height={windowHeight * 0.4}
                    alignItems="center"
                    justifyContent="center"
                    bg="rgba(0, 0, 0,0.3)"
                >
                    <ActivityIndicator />
                </Flex>
            ) : null}
        </Flex>
    );
};
