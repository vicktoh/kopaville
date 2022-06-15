import React, { FC, useRef } from 'react';
import Device from '../constants/Layout';
import { Center, Flex, Text, Image, Box, Button, Heading } from 'native-base';
import { FlatList, ListRenderItem } from 'react-native';
import { User } from '../types/User';
import { setLocalData } from '../services/local';
import { LOCAL_SYSTEM_INFO, ONBORDING_INFO } from '../constants/Storage';
import { System } from '../types/System';
const landingImage = require('../assets/images/landing.png');
const screen1Image = require('../assets/images/corper_group.png');
const screen3Image = require('../assets/images/corper7.png');
type ScreenItemProps = {
    scrollToNext: () => void;
    setOnboarded?: () => void;
};

const Landing: FC<ScreenItemProps> = ({ scrollToNext }) => {
    console.log({ scrollToNext });
    const { width, height } = Device.window;
    return (
        <Flex position="relative" width={width} height={height} bg="white" safeArea>
            <Box width={40} height={40} position="absolute" bg="secondary.300" bottom="20%" style = {{transform: [{rotate: '45deg'}]}} />
            <Box
                width="300px"
                height="300px"
                rounded="200px"
                position="absolute"
                bg="#E7FAE7"
                bottom={height / 2 - 100}
                right="-30%"
            />
            <Image alt="Youth coper" source={landingImage} position="absolute" style ={{transform: [{translateX: 45}]}} alignSelf="center" bottom={0} />
            <Heading mt={10} ml={10} size="2xl" fontWeight={700}>
                Kopaville.
            </Heading>
            <Text ml={10} mt={2}>
                hangout, connect and share memories, meet new friend and even find love ❤️
            </Text>
            <Button
                mt="auto"
                mb={50}
                mx={20}
                onPress={() => scrollToNext()}
                rounded="xl"
                py={4}
                _text={{ fontWeight: 'bold', fontSize: 'lg' }}
            >
                Get Started
            </Button>
        </Flex>
    );
};
const Initial: FC<ScreenItemProps> = ({ scrollToNext, setOnboarded }) => {
    const { width, height } = Device.window;
    
    return (
        <Flex position="relative" width={width} height={height} bg="white">
            <Image
                alt="Youth coper"
                source={screen1Image}
                position="absolute"
                alignSelf="center"
                width={width}
                height={height}
            />
            <Heading mt={10} ml={10} size="2xl" fontWeight={700} lineHeight="xs" color="primary.200" marginTop="auto">
                Welcome to Kopaville.
            </Heading>
            <Text   mt={2} px={5} marginLeft={10} fontWeight={'semibold'} color="secondary.400" mb={5} fontSize="md">
                Welcome to our amazing community of talented individuals.
            </Text>
            <Button.Group space={5} direction="column">
                <Button
                    variant="outline"
                    colorScheme="secondary"
                    mx={5}
                    rounded="lg"
                    py={4}
                    _text={{ fontWeight: 'bold', fontSize: 'lg' }}
                    onPress={()=> setOnboarded && setOnboarded()}
                >
                    Skip Into
                </Button>
                <Button
                    mb={100}
                    mx={5}
                    rounded="lg"
                    py={4}
                    onPress={() => scrollToNext()}
                    _text={{ fontWeight: 'bold', fontSize: 'lg' }}
                >
                    Next
                </Button>
            </Button.Group>
        </Flex>
    );
};

const Final: FC<ScreenItemProps> = ({ setOnboarded }) => {
    const { width, height } = Device.window;
    return (
        <Flex position="relative" width={width} height={height} bg="white" safeArea>
            <Image
                alt="Youth coper"
                source={screen3Image}
                position="absolute"
                alignSelf="center"
                bottom={0}
                right={0}
            />
            <Heading mt={10} ml={10} size="lg" color="primary.500" fontWeight={700}>
                A community where you can...
            </Heading>
            <Text ml={10} mt={2} marginLeft={10} mb={5} fontSize="md" lineHeight="xl">
                Connect and hangout with other corpers 🌍 ,🤝 Share bussiness ideas and get investors, 💼 Advertise your
                business or services, Find the love of your life ❤️{' '}
            </Text>
            <Button
                onPress={()=> setOnboarded && setOnboarded()}
                mt="auto"
                mb={50}
                mx={5}
                rounded="lg"
                py={4}
                _text={{ fontWeight: 'bold', fontSize: 'lg' }}
            >
                Lets Go ! 🚀
            </Button>
        </Flex>
    );
};
type FlatListItem = {
    id: number;
    title: string;
    Component: FC<ScreenItemProps>;
};

const Screens: FlatListItem[] = [
    {
        id: 0,
        title: 'GetStarted',
        Component: Landing,
    },
    {
        id: 1,
        title: 'Intro',
        Component: Initial,
    },
    {
        id: 2,
        title: 'Final',
        Component: Final,
    },
];
type OnboardingScreenProps = {
    setIsOnboarded: (value: boolean) => void;
    auth: User | null
    systemInfo: System | null
}
export const OnboardingScreen: FC<OnboardingScreenProps> = ({ setIsOnboarded, auth, systemInfo}) => {
    const flatListRef = useRef<any>();
    const onboardUser = async ()=>{
        const newData : System = {...(systemInfo|| {}), dateOnboarded: new Date().getTime()}
        await setLocalData(LOCAL_SYSTEM_INFO, JSON.stringify(newData));
        await setLocalData(ONBORDING_INFO, JSON.stringify(newData));
        setIsOnboarded(true);
   }
    const renderItem: ListRenderItem<FlatListItem> = ({ item, index, separators }) => {
        return (
            <item.Component
                scrollToNext={() => {
                    flatListRef.current.scrollToIndex({ animated: true, index: item.id + 1 });
                }}
                setOnboarded={onboardUser}
            />
        );
    };
    return (
        <FlatList
            ref={flatListRef}
            data={Screens}
            renderItem={renderItem}
            keyExtractor={(item) => item.title}
            pagingEnabled
            horizontal
        />
    );
};
