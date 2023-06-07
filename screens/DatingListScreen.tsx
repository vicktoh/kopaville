import React, { FC, useEffect, useMemo, useState } from 'react';
import { DatingStackParamList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    Button,
    FlatList,
    Flex,
    Heading,
    Text,
    useDisclose,
    useToast,
} from 'native-base';
import { useAppSelector } from '../hooks/redux';
import { Gender, Profile } from '../types/Profile';
import { EmptyState } from '../components/EmptyeState';
import { ActivityIndicator, ListRenderItemInfo, Modal, Pressable } from 'react-native';
import { DatingCard } from '../components/DatingCard';
import { convertFilterToAlgolier, fetchDatingProfiles } from '../services/datingServices';
import { useSearchIndex } from '../hooks/useSearchIndex';
import { DatingFilter, DatingFilterForm, DEFAULT_DATING_FILTER } from '../components/DatingFilterForm';
import { sub } from 'date-fns';
const PROFILE_PERPPAGE = 10;
const states = require('../assets/static/states.json');

type DatingListScreenProps = NativeStackScreenProps<
    DatingStackParamList,
    'Main'
>;

export const DatingListScreen: FC<DatingListScreenProps> = ({ navigation, route }) => {
    const { profile } = useAppSelector(({ auth, profile }) => ({
        profile,
        auth,
    }));
    const { filter: paramFilters } = route?.params || {};
    const oppSiteGender = profile?.loginInfo.gender == Gender.male ? Gender.female : Gender.male;
    const [filter, setFilter] = useState<DatingFilter>({...DEFAULT_DATING_FILTER, gender: oppSiteGender});
    const filterString = useMemo(()=> {
        return convertFilterToAlgolier({...DEFAULT_DATING_FILTER, gender: oppSiteGender});

    }, [])
    const {loading, data: datingProfiles, pageStat, setFilters, page, setPage } = useSearchIndex<Profile>("users", filterString, PROFILE_PERPPAGE, true);
  
    const toast = useToast();
    

    const renderItem = (listItem: ListRenderItemInfo<Profile>) => {
        return (
            <DatingCard
                profile={listItem.item}
                key={listItem.item.userId || `dating-card-${listItem.index}`}
            />
        );
    };

    const clearFilter = () => {
        setFilter(DEFAULT_DATING_FILTER);
    };

    

    useEffect(()=> {
        const onSearch = ()=> {
            if(!paramFilters) return;
            setFilter(paramFilters);
            setPage(0)
            const filterString = convertFilterToAlgolier(paramFilters);
            setFilters(filterString);
        }
        onSearch();
    }, [paramFilters])
    const onOpenAdvanceSearch = ()=> {
        navigation.navigate("Search", {
            filter,
        })
    }
    const renderFooter = ()=> {
        return (
            <>
            {page > 0 && (pageStat?.total || 0) > page * PROFILE_PERPPAGE ? (
            <Button
                size="sm"
                alignSelf="center"
                my={5}
                onPress={()=> setPage(page + 1)}
                isLoading={loading}
            >
                Load More
            </Button>
        ) : null}
            </>
        )
        
    }

    return (
        <Flex flex={1} bg="white">
            <Flex px={5} pt={3}>
                <Heading>Find Love ❤️</Heading>
                <Text>
                    Find the love of your life, we show you dating profiles of
                    single people around you, feel free to send a message to any
                    one of your choices
                </Text>
            </Flex>
            <Flex pt={3}>
                <Button
                    size="sm"
                    onPress={onOpenAdvanceSearch}
                    disabled={loading}
                    variant="link"
                    colorScheme="primary"
                >
                    Advanced Search
                </Button>
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
                    keyExtractor={(item, i) =>
                        item?.userId || `dating-card-${i}`
                    }
                    flex={1}
                    contentContainerStyle={{ paddingLeft: 5, paddingRight: 5 }}
                    ListFooterComponent={renderFooter()}
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
