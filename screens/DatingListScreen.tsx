import React, { FC, useEffect, useState } from 'react';
import { DatingStackParamList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    Button,
    ChevronDownIcon,
    FlatList,
    Flex,
    FormControl,
    Heading,
    PresenceTransition,
    Select,
    Text,
    useToast,
} from 'native-base';
import { useAppSelector } from '../hooks/redux';
import { Profile } from '../types/Profile';
import { EmptyState } from '../components/EmptyeState';
import { ActivityIndicator, ListRenderItemInfo } from 'react-native';
import { DatingCard } from '../components/DatingCard';
import { fetchDatingProfiles } from '../services/datingServices';

const states = require('../assets/static/states.json');

type DatingListScreenProps = NativeStackScreenProps<DatingStackParamList, 'Main'>;

export const DatingListScreen: FC<DatingListScreenProps> = ({ navigation }) => {
    const { profile } = useAppSelector(({ auth, profile }) => ({ profile, auth }));
    const [datingProfiles, setDatingProfiles] = useState<Profile[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [locationFilter, setLocationFilter] = useState<string>();
    const [fetchData, setFetchData] = useState<boolean>(false);
    const toast = useToast();
    useEffect(() => {
        const fetchDatingProfile = async () => {
            try {
                setLoading(true);
                const profiles = await fetchDatingProfiles('', locationFilter || undefined);
                setDatingProfiles(profiles);
            } catch (error) {
                console.log(error);
                const err: any = error;
                toast.show({
                    title: 'Could not fetch profiles',
                    description: err?.message || 'Could not fetch profile, please try again',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchDatingProfile();
    }, [fetchData]);

    const renderItem = (listItem: ListRenderItemInfo<Profile>) => {
        return <DatingCard profile={listItem.item} key={listItem.item.userId || `dating-card-${listItem.index}`} />;
    };

    const clearFilter = () => {
        setLocationFilter('');
        setFetchData((fetch)=> !fetch)
        setShowFilter(false);
    };

    return (
        <Flex flex={1} bg="white">
            <Flex px={5} pt={3}>
                <Heading>Find Love ❤️</Heading>
                <Text>
                    Find the love of your life, we show you dating profiles of single people around you, feel free to send a message
                    to any one of your choices
                </Text>
                <Flex direction="row" alignItems="center">
                    <Button variant="link" size="sm" onPress={() => setShowFilter((filter) => !filter)}>
                        {showFilter ? 'Hide filter' : 'Show filter'}
                    </Button>
                </Flex>
                {showFilter ? (
                    <PresenceTransition
                        visible={showFilter}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1, transition: { duration: 250 } }}
                    >
                        <FormControl>
                            <FormControl.Label>Location</FormControl.Label>
                            <Select
                                onValueChange={(value) => setLocationFilter(value)}
                                _actionSheetContent={{ bg: 'white' }}
                                _selectedItem={{ bg: 'primary.100', color: 'gray.700' }}
                                dropdownIcon={<ChevronDownIcon color="primary.300" />}
                                accessibilityLabel="Choose account type"
                                size="sm"
                                selectedValue={locationFilter}
                                variant="outline"
                                borderColor="primary.400"
                            >
                                {states.map((name: string, i: number) => (
                                    <Select.Item value={name} label={name} key={`filter-location-${i}`} />
                                ))}
                            </Select>
                        </FormControl>

                        <Flex direction="row" py={2} alignItems="center">
                            <Button variant="outline" size="sm" onPress={clearFilter}>
                                Clear
                            </Button>
                            <Button ml={3} variant="solid" size="sm" onPress={ ()=> setFetchData((fetch)=> !fetch) }>
                                Filter
                            </Button>
                        </Flex>
                    </PresenceTransition>
                ) : null}
            </Flex>

            {loading ? (
                <Flex flex={1} justifyContent="center" alignItems="center">
                    <ActivityIndicator size={24} color="green" />{' '}
                    <Text>Fetching profiles...</Text>
                </Flex>
            ) : datingProfiles?.length ? (
                <FlatList
                    data={datingProfiles}
                    renderItem={renderItem}
                    keyExtractor={(item, i) => item?.userId || `dating-card-${i}`}
                    flex={1}
                    contentContainerStyle={{paddingLeft: 5, paddingRight: 5}}
                />
            ) : (
                <Flex flex={1} p={5}>
                    <EmptyState
                        title="No Dating Profiles Found"
                        description="No Dating Profiles to show. Please refresh or select another location"
                    />
                </Flex>
            )}
        </Flex>
    );
};
