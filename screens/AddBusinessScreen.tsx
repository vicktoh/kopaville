import { AntDesign } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Flex, Heading, Icon, IconButton, KeyboardAvoidingView, ScrollView } from 'native-base';
import React, {FC} from 'react';
import { Platform } from 'react-native';
import { AddServiceForm } from '../components/AddServiceForm';
import { JobStackParamList } from '../types';


type AddBusinessScreenProps= NativeStackScreenProps<JobStackParamList, "Add Business">




export const AddBusinessScreen: FC<AddBusinessScreenProps> = ({ navigation })=>{



    return(
        <KeyboardAvoidingView  behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView bg = "white" >
            <Flex flex = {1} px={5} safeArea>
            <Flex>
                <IconButton onPress={()=> navigation.goBack()} icon = {<Icon as = {AntDesign} name = "arrowleft" />} />
            </Flex>
            <Heading>Add Business/ Service</Heading>
            <AddServiceForm  onCancel={()=> navigation.goBack()} mode="add"/>
            </Flex>
        </ScrollView>
        </KeyboardAvoidingView>
    )
}