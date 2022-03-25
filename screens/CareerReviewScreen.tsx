import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Flex, useToast } from 'native-base';
import React, {FC, useEffect, useState} from 'react';
import { ActivityIndicator } from 'react-native';
import { CareerProfile } from '../components/CareerProfile';
import { EmptyState } from '../components/EmptyeState';
import { fetchUserProfile } from '../services/profileServices';
import { HomeStackParamList } from '../types';
import { Profile } from '../types/Profile';


type CareerReviewScreenProps = NativeStackScreenProps<HomeStackParamList, "CareerPreview">



export const CareerReviewScreen : FC<CareerReviewScreenProps> = ({navigation, route}) =>{
   const { profile, fetch, userId} = route.params;
   const [loading, setLoading] = useState<boolean>(false);
   const [userProfile, setProfile] = useState<Profile | null>(profile || null)
   const toast = useToast();
   useEffect(()=>{
      const fetchUser = async () =>{
         if(userId && !userProfile){
            try {
               setLoading(true);
               const user = await fetchUserProfile(userId);
               console.log(user);
               if(user) setProfile(user as Profile);
            } catch (error) {
               let err: any = error;
               toast.show({title: "Error Occured", status: "error", placement: "top", description: err?.message || "Error occured try again"});
            }
            finally{
               setLoading(false)
            }
         }
      }
      fetchUser();
   }, [profile, userId ])

   if(loading){
      return (
         <Flex flex = {1} justifyContent="center" alignItems="center">
            <ActivityIndicator />
         </Flex>
      )
   }
   if(userProfile){
      return(<Flex flex={1} bg="white">
         <CareerProfile profile={userProfile} />
      </Flex>)
   }
   return(
      <EmptyState />
   )


}