import React, {FC, useState} from 'react';
import { HomeStackParamList } from '../types';
import { NavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Flex, FormControl, Heading, Modal, Stack, TextArea } from 'native-base';
import { reportPost } from '../services/postsServices';
import { useAppSelector } from '../hooks/redux';

const REPORT_REASONS = [
   "Malicious Content",
   "Sexual Activity and Nudity",
   "Falsehood and Missinformation",
   "Violence",
   "Hate Speech",
   "Sale of Illegal Goods"
]


type ReportScreenProps = NativeStackScreenProps<HomeStackParamList, "Report">

export const ReportPostScreen : FC<ReportScreenProps> = ({navigation, route})=> {
   const { postUsername, postUserId, postId, postText} = route.params
   const auth = useAppSelector(({auth})=> auth)
   const [seletedReason, setSelectedReason] = useState<number>();
   const [isReporting, setReporting] = useState<boolean>(false);

   const report = async () => {
      if(!seletedReason) return;
      setReporting(true)
      await reportPost({postId,  postUserId, reporterId: auth?.userId || "", reason: REPORT_REASONS[seletedReason] });
      setReporting(false);
      navigation.goBack();
   }
   return(
      <Flex flex={1} px={5} pt={2} bg="white" >
        <Heading>{`Report post by ${postUsername}`}</Heading>

        <Heading fontSize="sm" mt={5}>Reason for Report</Heading>

        <Flex flex = {1}>
           {
              REPORT_REASONS.map((reason, i)=>(
                 <Button key = {`reason-${i}`} my={2} size="lg" bg = {i === seletedReason ? "primary.200" : "secondary.200"}  onPress={()=> setSelectedReason(i)}>
                    {reason}
                 </Button>
              ))
           }

           <Button isLoading={isReporting} disabled={seletedReason == undefined} size = "lg" mt={3} onPress={report}> Report Post</Button>
        </Flex>


      </Flex>
   )

}