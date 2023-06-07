import React, {FC} from 'react';
import { Heading, ScrollView, Flex, IconButton, Icon, KeyboardAvoidingView } from 'native-base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { JobStackParamList } from '../types';
import { AntDesign } from '@expo/vector-icons';
import { AddJobForm } from '../components/AddJobForm';
import { Platform } from 'react-native';





type EditJobScreenProps = NativeStackScreenProps<JobStackParamList, "Edit Job">

export const EditJobScreen: FC<EditJobScreenProps> = ({ route , navigation})=>{
      const { job } = route.params

    return (
        <KeyboardAvoidingView  behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView bg = "white" >
            <Flex flex = {1} px={5} safeArea>
            <Flex>
                <IconButton onPress={()=> navigation.goBack()} icon = {<Icon as = {AntDesign} name = "arrowleft" />} />
            </Flex>
            
            <AddJobForm job={job}  onCancel={()=> navigation.goBack()} mode="edit"/>
            </Flex>

        </ScrollView>
        </KeyboardAvoidingView>
    )
}