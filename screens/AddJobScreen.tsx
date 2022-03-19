import React, {FC} from 'react';
import { Heading, ScrollView, Flex, IconButton, Icon, KeyboardAvoidingView } from 'native-base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { JobStackParamList } from '../types';
import { AntDesign } from '@expo/vector-icons';
import { AddJobForm } from '../components/AddJobForm';
import { Platform } from 'react-native';





type AddJobScreenProps = NativeStackScreenProps<JobStackParamList, "Add Job">

export const AddJobScreen: FC<AddJobScreenProps> = ({ route , navigation})=>{
    

    return (
        <KeyboardAvoidingView  behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView bg = "white" >
            <Flex flex = {1} px={5} safeArea>
            <Flex>
                <IconButton onPress={()=> navigation.goBack()} icon = {<Icon as = {AntDesign} name = "arrowleft" />} />
            </Flex>
            <Heading>Add Job Oppening</Heading>
            <AddJobForm  onCancel={()=> navigation.goBack()} mode="add"/>
            </Flex>

        </ScrollView>
        </KeyboardAvoidingView>
    )
}