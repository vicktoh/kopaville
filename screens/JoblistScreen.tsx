import React, { FC, useEffect, useState } from 'react';
import { Button, ChevronDownIcon, FlatList, Flex, FormControl, Heading, HStack, Input, PresenceTransition, ScrollView, Select, Text, useDisclose, useToast } from 'native-base';
import { Job, Business } from '../types/Job';
import { listenOnJobs } from '../services/jobServices';
import { setLocalData } from '../services/local';
import { ActivityIndicator, ListRenderItemInfo, Modal, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { JobStackParamList } from '../types';
import { JobCard } from '../components/JobCard';

const states = require('../assets/static/states.json');


const EmtpyJobList: FC = ()=>{
    return (
        <Flex p={5} flex={1} justifyContent="center" alignItems="center" my={2} borderWidth={1} borderColor="primary.300">
            <Heading mb={2}>No Job, Services, Business Yet 💼</Heading>
            <Text lineHeight="xl">Watch out on this space for jobs, services and businesses across different locations in Nigeria.
                You can also post your  job, service or business or service for people to find you
            </Text>
        </Flex>
    )
}
type JoblistScreenProps = NativeStackScreenProps<JobStackParamList, "Main">

export const JoblistScreen: FC<JoblistScreenProps> = ({ navigation }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [posts, setPosts] = useState<(Job & Business)[]>();
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [locationFilter, setLocationFilter] = useState<string>("");
    const [typeFilter, setTypeFilter] = useState<"job"| "service">();
    const [fetchData, setFetchData] = useState<boolean>(false);
    const {width: windowWidth} = useWindowDimensions();

    const toast = useToast();
    useEffect(() => {
        const fetchUserList = async () => {
            const filter: {location?: string, type?: 'job'|'service'} = {};
            if(locationFilter) filter.location = locationFilter;
            if(typeFilter) filter.type = typeFilter;
            try {
                setLoading(true);
                const unsubscribe = await listenOnJobs((post)=> {
                    setLoading(false);
                    setPosts(post)
                }, filter);
                return unsubscribe;
            } catch (error) {
                console.log(error)
                toast.show({title: "Error Fetch Job", description: "Could not fetch post, ensure you have good internet connection and try again", status: "error"});
                
            } 
        };

        fetchUserList();
    }, [fetchData]);

    const renderItem = (info: ListRenderItemInfo<Job & Business>) =>{
        return <JobCard job = {info.item} />
    }
    const clearFilter = ()=>{
        setLocationFilter('');
        setTypeFilter(undefined);
        setFetchData((fetch)=> !fetch);
        setShowFilter(false)
    }

    return (
            <Flex flex={1} safeArea px={5} bg = "white">
                <Flex py={3}>
                    <Heading fontSize="lg">JOBS AND BUSINESSES</Heading>
                    <Text fontSize="md" mt={1}>
                        Find jobs, business ideas, and connect with others
                    </Text>
                    <Flex direction="row" py={1} justifyContent="space-between">
                        <Button variant="link" size="md" onPress={()=>navigation.navigate("Add Job")}>
                            Add Job
                        </Button>
                        <Button variant="link" size="md" onPress={()=> navigation.navigate("Add Business")}>
                            Add  Service
                        </Button>
                        <Button variant="link" size="md" onPress={( ) => setShowFilter((filter)=> !filter)}>
                            {showFilter ? "Hide Filter": "Show Filter"}
                        </Button>
                    </Flex>
                   {showFilter ?( 
                   <PresenceTransition visible={showFilter} initial = {{opacity: 0, scaleY: 0}} animate = {{opacity: 1, scaleY: 1, transition: {duration: 250}}}>
                        <HStack direction='row' alignItems="center" space={3} mt={3}>
                            <FormControl maxWidth={windowWidth/2 - 20}>
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
                                {states.map((name:string, i: number) => (
                                    <Select.Item value={name} label={name} key={`filter-location-${i}`}  />
                                ))}
                            </Select>
                            </FormControl>
                            <FormControl maxWidth={windowWidth/2 - 30}>
                            <FormControl.Label>Type</FormControl.Label>
                            <Select
                                onValueChange={(value) => setTypeFilter(value as ('job'| 'service'))}
                                _actionSheetContent={{ bg: 'white' }}
                                _selectedItem={{ bg: 'primary.100', color: 'gray.700' }}
                                dropdownIcon={<ChevronDownIcon color="primary.300" />}
                                accessibilityLabel="Choose account type"
                                size="sm"
                                selectedValue={typeFilter}
                                variant="outline"
                                borderColor="primary.400"
                            >
                                    <Select.Item key={`filter-type-job`} value='job' label='job' />
                                    <Select.Item key={`filter-type-service`} value='service' label='Business/Services' />
                            </Select>
                            </FormControl>
                        </HStack>
                        <Flex direction='row' py={2}>
                            <Button onPress={()=> clearFilter() }  variant="link" size="xs">Clear Filter</Button>

                        </Flex>
                        <Button isLoading={loading} isLoadingText="Fetching Data" onPress={ () => setFetchData((fetch) => !fetch) } variant="solid">Filter </Button>
                    </PresenceTransition>): null}
                </Flex>
                {
                    loading? 
                    (<Flex flex = {1} justifyContent="center" alignItems="center"><ActivityIndicator color="green" size={24}/><Text>Please wait</Text> </Flex>):
                    (posts?.length ? (
                        <FlatList data = {posts} renderItem={renderItem} keyExtractor={(item)=> item?.title || item?.name } flex ={1}/>
                    ): <EmtpyJobList/>)
                }
            </Flex>
            
    );
};
