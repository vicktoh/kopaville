import { CameraCapturedPicture } from 'expo-camera';
import { Asset } from 'expo-media-library';
import React from 'react';
import { FC } from 'react';
import { useState } from 'react';
import { GalleryPicker } from '.';
import KruiseCamera from '../KruiseCamera';
import KruiseCropper from '../KruiseCropper';

type ImagePickCropperProps = {
    type: 'camera' | 'gallery';
};
export const ImagePickCropper: FC<ImagePickCropperProps> = ({ type }) => {
    const [view, setView] = useState<'picker' | 'cropper'>('picker');
    const [selectedImage, setSelectedImage] = useState<
        Asset | CameraCapturedPicture
    >();

    const onCrop = (uri: string) => {};
    const onConfirmPicked = (asset: Asset[]) => {
        setSelectedImage(asset[0]);
        setView('cropper');
    };
    const onConfirmCapture = (photo: CameraCapturedPicture) => {
        setSelectedImage(photo);
        setView('cropper');
    };
    if (view === 'cropper' && selectedImage) {
        return (
            <KruiseCropper
               imageHeight={selectedImage.height}
               imageWidth={selectedImage.width}
                uri={selectedImage.uri}
                width={300}
                height={300}
                onCrop={onCrop}
                onCancel={()=> setView('picker')}
            />
        );
    }
    return type === 'camera' ? (
        <KruiseCamera onConfirmCapturedImage={onConfirmCapture} />
    ) : (
        <GalleryPicker
            max={1}
            mediaType="photo"
            selectMultiple={false}
            onSelectComplete={onConfirmPicked}
        />
    );
};
