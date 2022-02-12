import { Center, Text } from 'native-base';
import React, {FC} from 'react';
import { useAppSelector } from './hooks/redux';
import Navigation from './navigation';
import { OnboardingScreen } from './screens/OnboardingScreen';



 

export const Layout: FC = () =>{
    return(
        <Center>
            <Text>Hello there</Text>
        </Center>
    )
}