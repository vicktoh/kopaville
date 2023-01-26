import {
    Button,
    FlatList,
    Flex,
    Image,
    Pressable,
    useToast,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { ResizeMode, Video } from 'expo-av';
import { PagedInfo, Asset, Album } from 'expo-media-library';
import { ListRenderItemInfo, useWindowDimensions } from 'react-native';
import { FC } from 'react';
import { AlbumsOptions } from './AlbumsOptions';
import { LoadingScreen } from '../../screens/LoadingScreen';
import { useMemo } from 'react';
type GallerPickerProps = {
    selectMultiple?: boolean;
    mediaType?: 'photo' | 'video';
    initialAssets?: Asset[];
    max: number;
    onSelectComplete: (uri: Asset[]) => void;
};
type Gallery = {
    resourceUri: string[];
};
type VideoComponentProps = {
    id: string;
    imageWidth: number;
};
export const VideoComponent: FC<VideoComponentProps> = ({ id, imageWidth }) => {
    const [localUri, setUri] = useState<string>('');

    useEffect(() => {
        const fetchAssetInfo = async () => {
            if (localUri) return;
            let assetInfo = await MediaLibrary.getAssetInfoAsync(id);
            setUri(assetInfo.localUri || assetInfo.uri);
        };
        fetchAssetInfo();
    }, []);
    return (
        <Video
            usePoster={true}
            resizeMode={ResizeMode.COVER}
            source={{ uri: localUri }}
            style={{ flex: 1, width: imageWidth, height: (4 / 3) * imageWidth }}
        />
    );
};
export const GalleryPicker: FC<GallerPickerProps> = ({
    selectMultiple = true,
    onSelectComplete,
    mediaType = 'photo',
    initialAssets,
    max
}) => {
    const [mode, setMode] = useState<'gallery' | 'camera'>('gallery');
    const [pageInfo, setPageInfo] = useState<PagedInfo<Asset>>();
    const [albums, setAlbums] = useState<Album[]>();
    const [selectedAlbum, setSelectedAlbum] = useState<Album>();
    const [fetchingImages, setFetchingImages] = useState<boolean>(false);
    const [selectedResources, setSelectedResources] = useState<Asset[]>(
        initialAssets || []
    );
    const toast = useToast();
    const { width, height } = useWindowDimensions();
    const imageWidth = width / 3 - 3;
    const assestTorender = useMemo(() => {
        let assets = (pageInfo?.assets || []).map((asset) => {
            const isSelected = selectedResources
                .map((res) => res.uri)
                .includes(asset.uri);
            return { ...asset, isSelected };
        });
        return assets;
    }, [selectedResources, pageInfo]);
    const onSelectAlbum = async (album: Album | undefined) => {
        setSelectedAlbum(album);
    };
    const onSelectImage = (asset: Asset) => {
        if (!pageInfo?.assets) return;
        if (!selectMultiple) {
            onSelectComplete([asset]);
            return;
        }
        const copySelectedResources = [...selectedResources];
        const index = copySelectedResources
            .map((resource) => resource.uri)
            .indexOf(asset.uri);
        if (index > -1) {
            copySelectedResources.splice(index, 1);
            setSelectedResources(copySelectedResources);
        } else {
            if (selectedResources.length >= max) return;
            copySelectedResources.push(asset);
            setSelectedResources(copySelectedResources);
        }
    };

    const renderMediaItem = ({
        item,
        index,
    }: ListRenderItemInfo<Asset & { isSelected: boolean }>) => {
        const { mediaType, id } = item;

        return (
            <Pressable onPress={() => onSelectImage(item)}>
                <Flex
                    width={imageWidth}
                    height={(4 / 3) * imageWidth}
                    borderWidth={item.isSelected ? 2 : 0}
                    borderColor={
                        item.isSelected ? 'primary.400' : 'transparent'
                    }
                >
                    {mediaType === 'photo' ? (
                        <Image alt="gallery image" src={item.uri} flex={1} />
                    ) : null}
                    {mediaType === 'video' ? (
                        <VideoComponent  id={item.id} imageWidth={imageWidth} />
                    ) : null}
                </Flex>
            </Pressable>
        );
    };
    useEffect(() => {
        const fetchGalleryImages = async () => {
            const { granted } = await MediaLibrary.getPermissionsAsync();
            if (!granted) {
                const { granted: isGranted } =
                    await MediaLibrary.requestPermissionsAsync();
                if (!isGranted) {
                    toast.show({
                        title: 'Persmission denied',
                        description:
                            'Media library permission is needed for share photos and videos',
                    });
                    return;
                }
            }
            setFetchingImages(true);
            const library = await MediaLibrary.getAssetsAsync({
                album: selectedAlbum,
                mediaType,
                first: 1000,
            });
            setFetchingImages(false);
            setPageInfo(library);
        };
        fetchGalleryImages();
    }, [selectedAlbum]);
    useEffect(() => {
        const fetchAlbums = async () => {
            const { granted } = await MediaLibrary.getPermissionsAsync();
            if (!granted) {
                const { granted: isGranted } =
                    await MediaLibrary.requestPermissionsAsync();
                if (!isGranted) {
                    return;
                }
            }
            const mediaAlbums = await MediaLibrary.getAlbumsAsync();
            setAlbums(mediaAlbums);
        };
        fetchAlbums();
    }, []);
    if (mode == 'gallery') {
        return (
            <Flex position="relative" flex={1}>
                <Flex
                    direction="row"
                    justifyContent="space-between"
                    mb={2}
                    zIndex={5}
                >
                    {albums?.length ? (
                        <AlbumsOptions
                            albums={albums}
                            onSelectAlbum={onSelectAlbum}
                        />
                    ) : null}
                    {selectMultiple && selectedResources.length ? (
                        <Button
                            variant="link"
                            colorScheme="primary"
                            onPress={() => onSelectComplete(selectedResources)}
                        >
                            Done
                        </Button>
                    ) : null}
                </Flex>

                {pageInfo && !fetchingImages ? (
                    <FlatList
                        data={assestTorender}
                        numColumns={3}
                        renderItem={renderMediaItem}
                    />
                ) : (
                    <LoadingScreen />
                )}
            </Flex>
        );
    }
    return <Flex>{}</Flex>;
};
