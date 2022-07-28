import React, { ComponentType } from 'react';
import { CloseIcon, Flex, Icon, IconButton, Image } from 'native-base';
import {
    Gesture,
    GestureDetector,
    gestureHandlerRootHOC,
} from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';
import { ImageBackground, StyleSheet, useWindowDimensions } from 'react-native';

type KruiseCropperTypes = {
    uri: string;
    onCrop: (uri: string) => void;
    imageWidth: number;
    imageHeight: number;
    width: number;
    height: number;
    onCancel: () => void;
};

const styles = StyleSheet.create({
    cropperStyle: {
        borderWidth: 3,
        borderColor: 'blue',
    },
});
const KruiseCropper: ComponentType<KruiseCropperTypes> = gestureHandlerRootHOC(
    ({ uri, width, height, onCancel, imageWidth, imageHeight }) => {
        const { width: windowWidth, height: windowHeight } =
            useWindowDimensions();
        const offset = useSharedValue({ x: 0, y: 0 });
        const animatedStyle = useAnimatedStyle(() => {
            return {
                transform: [
                    { translateX: offset.value.x },
                    { translateY: offset.value.y },
                ],
            };
        });
        const start = useSharedValue({
            x: windowWidth / 2 - width / 2,
            y: windowHeight / 2 - height / 2,
        });

        const gesture = Gesture.Pan()
            .onBegin(() => {
                'worklet';
                console.log('ives started');
            })
            .onUpdate((e) => {
                console.log(e);
                console.log('i am changing');
                offset.value = {
                    x: start.value.x + e.translationX,
                    y: start.value.y + e.translationY,
                };
            })
            .onEnd(() => {
                start.value = {
                    x: offset.value.x,
                    y: offset.value.y,
                };
            });
        return (
            <Flex flex={1} borderColor="black" borderWidth={1}>
                <IconButton
                    position="absolute"
                    left={2}
                    top={2}
                    icon={<CloseIcon />}
                    onPress={onCancel}
                />
                <ImageBackground
                    source={{ uri }}
                    style={{ transform: [{ scale: 2 }] }}
                    width={imageWidth}
                    height={imageHeight}
                >
                    <GestureDetector gesture={gesture}>
                        <Animated.View
                            style={[
                                styles.cropperStyle,
                                { width, height },
                                animatedStyle,
                            ]}
                        />
                    </GestureDetector>
                </ImageBackground>
                {/* <Image flex={1} src = {uri} /> */}
            </Flex>
        );
    }
);

export default KruiseCropper;
