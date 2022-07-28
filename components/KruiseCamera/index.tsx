import React from 'react';
import {
    Button,
    Flex,
    Heading,
    HStack,
    Icon,
    IconButton,
    Image,
    Text,
} from 'native-base';
import { Camera, PermissionResponse } from 'expo-camera';
import { useState } from 'react';
import { useEffect } from 'react';
import { LoadingScreen } from '../../screens/LoadingScreen';
import { useCallback } from 'react';
import { useRef } from 'react';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
import {
    CameraCapturedPicture,
    CameraType,
} from 'expo-camera/build/Camera.types';
import { FC } from 'react';

type KruiseCameraProps = {
    onConfirmCapturedImage: (image: CameraCapturedPicture) => void;
};
const KruiseCamera: FC<KruiseCameraProps> = ({ onConfirmCapturedImage }) => {
    const [permission, setHasPermission] = useState<PermissionResponse>();
    const [cameraSide, setCameraSide] = useState<CameraType>(CameraType.back);
    const [loading, setLoading] = useState<boolean>();
    const [cameraReady, setCameraReady] = useState<boolean>();
    const [capturedImage, setCaptureImage] = useState<CameraCapturedPicture>();
    const { width: windowWidth } = useWindowDimensions();
    const requestPermission = useCallback(async () => {
        try {
            setLoading(true);
            const permissionReseponse =
                await Camera.requestCameraPermissionsAsync();
            setHasPermission(permissionReseponse);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);
    const cameraRef = useRef<Camera>(null);
    useEffect(() => {
        requestPermission();
    }, []);

    const takePicture = async () => {
        const response = await cameraRef.current?.takePictureAsync();
        setCaptureImage(response);
    };

    const toggleCameraType = () => {
        setCameraSide((side) =>
            side === CameraType.back ? CameraType.front : CameraType.back
        );
    };
    if (permission === undefined) {
        return <LoadingScreen label="please wait" />;
    }
    if (!permission.granted) {
        <Flex flex={1} justifyContent="center" alignItems="center" safeArea>
            <Heading>Camera Permission is required</Heading>
            <Text my={5}>
                Kopaville needs access to your camera to take pictures and video
                for upload, please click allow on the resulting popup
            </Text>
            {permission.canAskAgain ? (
                <Button variant="solid" onPress={requestPermission}>
                    Request for Access
                </Button>
            ) : null}
        </Flex>;
    }
    return (
        <Flex direction="column" position="relative" flex={1}>
            {capturedImage ? (
                <>
                    <Image
                        alt="captured images"
                        src={capturedImage.uri}
                        flex={1}
                    />
                    <Flex
                        width={windowWidth}
                        direction="row"
                        justifyContent="center"
                        bottom={5}
                        alignItems="center"
                        position="absolute"
                    >
                        <HStack space={5}>
                            <IconButton
                                icon={
                                    <Icon as={AntDesign} name="closecircleo" />
                                }
                                onPress={() => setCaptureImage(undefined)}
                                variant="outline"
                                colorScheme="red"
                            />
                            <IconButton
                                onPress={() =>
                                    onConfirmCapturedImage(capturedImage)
                                }
                                icon={
                                    <Icon as={AntDesign} name="rightcircleo" />
                                }
                                colorScheme="primary"
                                variant="solid"
                            />
                        </HStack>
                    </Flex>
                </>
            ) : (
                <Camera
                    onCameraReady={() => setCameraReady(true)}
                    style={{ flex: 1 }}
                    ref={cameraRef}
                    type={cameraSide}
                >
                    <IconButton
                        my={2}
                        ml={2}
                        alignSelf="flex-start"
                        onPress={toggleCameraType}
                        variant="ghost"
                        icon={
                            <Icon
                                color="white"
                                as={MaterialIcons}
                                name={
                                    Platform.OS === 'android'
                                        ? 'flip-camera-android'
                                        : 'flip-camera-ios'
                                }
                            />
                        }
                    />
                    {loading ? (
                        <ActivityIndicator
                            color="green"
                            size={24}
                            style={{
                                marginHorizontal: 'auto',
                                alignSelf: 'center',
                            }}
                        />
                    ) : null}
                    <IconButton
                        disabled={!!!cameraReady}
                        onPress={takePicture}
                        variant="solid"
                        icon={<Icon as={MaterialIcons} name="camera" />}
                        alignSelf="center"
                        mb={5}
                        mt="auto"
                    />
                </Camera>
            )}
        </Flex>
    );
};

export default KruiseCamera;
