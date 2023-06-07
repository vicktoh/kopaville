import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { JobStackParamList } from '../types';
import { JoblistScreen } from '../screens/JoblistScreen';
import { AddBusinessScreen } from '../screens/AddBusinessScreen';
import { AddJobScreen } from '../screens/AddJobScreen';
import { JobDetailsScreen } from '../screens/JobDetailsScreen';
import { EditJobScreen } from '../screens/EditJobScreen';

const JobStack = createNativeStackNavigator<JobStackParamList>();

export const JobNavigation = () => {
    return (
        <JobStack.Navigator initialRouteName='Main'>
                <JobStack.Group>
                <JobStack.Screen name="Main" component={JoblistScreen} options={{ headerShown: false }} />
                <JobStack.Screen name="Add Job" component={AddJobScreen} options={{ headerShown: false }} />
                <JobStack.Screen name="Add Business" component={AddBusinessScreen} options={{ headerShown: false }} />
                
                </JobStack.Group>
               <JobStack.Group screenOptions={{presentation: "modal"}} >
                <JobStack.Screen name="Job Details" component={JobDetailsScreen} options={{ headerShown: false }} />
                <JobStack.Screen name="Edit Job" component={EditJobScreen} options={{ headerShown: false }} />
               </JobStack.Group>
        
        </JobStack.Navigator>
    );
};
