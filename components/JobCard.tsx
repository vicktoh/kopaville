import { AntDesign, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { Badge, Flex, Heading, HStack, Icon, Pressable, Text, VStack } from 'native-base';
import React, {FC} from 'react';
import { JobStackParamList } from '../types';
import { Business, Job } from '../types/Job';
import { BussinessForm } from './BussinessForm';



type JobCard = {
    job: Business & Job
}



export const  JobCard: FC<JobCard> = ({job})=>{
    
    const date = job.dateAdded ? format(job.dateAdded?.toDate(), "do MMM y") : "";
    const navigation = useNavigation<NavigationProp<JobStackParamList>>()
    return (
        <Pressable flex = {1} onPress = {() => navigation.navigate("Job Details", {job})}>

        <Flex p={5} borderWidth = {1} position="relative" rounded="lg" borderColor="primary.400" mb={4}>
            <Heading lineHeight="md" fontSize="lg" mb={1} noOfLines={2}>{job?.name || job?.title}</Heading>
            {
                job?.organisation ?
                <Text fontSize="md" mb = {3}>{job.organisation}</Text>:
                null
            }
            <HStack space ={1} alignItems="center">
                <Icon size = "xs" as = {Entypo} color="primary.400" name = "location-pin" />
                <Text fontSize="sm">{job?.location || job?.address}</Text>
            </HStack>
            <VStack mt={3} pl={5}>
            {
                job?.criteria ? 
                job.criteria.filter((cri, i) => i < 2).map((cri, i)=>(
                <Text ml={5} fontSize="xs" key = {`criteria-${i}`}>
                    {cri}
                </Text>)):
                null
            }
            {
                job?.services ? 
                job.services.filter((cri, i) => i < 2).map((cri, i)=>(
                <Text ml={3} fontSize="xs" key = {`criteria-${i}`}>
                    {cri}
                </Text>)):
                null
            }
            </VStack>
            
            <Badge position="absolute" top={5} right={5} rounded="lg" bg = {job?.title? "teal.300" : "orange.300"}>{job?.title ? "Job": "Service"}</Badge>
            <Flex direction='row' justifyContent="flex-end">
                <Text fontSize="sm" color="primary.400">{date}</Text>
            </Flex>
        </Flex>
        </Pressable>

    )

}