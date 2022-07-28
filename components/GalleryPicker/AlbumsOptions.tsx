import { Box, Button, Flex, Icon, Pressable, Text, VStack } from 'native-base';
import React from 'react';
import { Album } from 'expo-media-library';
import { FC } from 'react';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
type AlbumsOptionsProps = {
    albums: Album[];
    onSelectAlbum: (album: Album | undefined) => void;
};
export const AlbumsOptions: FC<AlbumsOptionsProps> = ({
    albums,
    onSelectAlbum,
}) => {
    const [selectedAlbum, setSelectedAlbum] = useState<Album>();
    const [showMenu, setShowMenu] = useState<boolean>(false);

    const onSelectOption = (album: Album | undefined) => {
        setSelectedAlbum(album);
        onSelectAlbum(album);
        setShowMenu((show) => !show);
    };
    return (
        <>
            {showMenu ? (
                <VStack position="absolute" left={3} top={3} space={1}  zIndex={2}>
                  <Button
                            size="sm"
                            variant="solid"
                            color="white"
                            zIndex={3}
                            key={`album-option-all`}
                            onPress={() => onSelectOption(undefined)}
                            style={{
                                paddingLeft: 3,
                                paddingVertical: 3,
                            }}
                        >
                            All
                        </Button>
                    {albums.map((value, i) => (
                        <Button
                            size="sm"
                            variant="solid"
                            color="white"
                            zIndex={3}
                            key={`album-option-${i}`}
                            onPress={() => onSelectOption(value)}
                            style={{
                                paddingLeft: 3,
                                paddingVertical: 3,
                            }}
                        >
                            {value.title}
                        </Button>
                    ))}
                </VStack>
            ) : null}
            <Button
                my={1}
                mx={3}
                rightIcon={<Icon as={AntDesign} size={3} name="caretdown" />}
                alignSelf="flex-start"
                variant="outline"
                onPress={() => setShowMenu((show) => !show)}
            >
                {selectedAlbum?.title || "All"}
            </Button>
        </>
    );
};
