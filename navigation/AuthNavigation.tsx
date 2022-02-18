import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { PasswordRecoveryScreen } from '../screens/PasswordRecoveryScreen';
export const AuthNavigation = () => {
    return (
        <AuthStack.Navigator>
            <AuthStack.Group>
                <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <AuthStack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            </AuthStack.Group>
            <AuthStack.Group screenOptions={{presentation: 'containedModal'}}>
                <AuthStack.Screen name="Forgot" component={PasswordRecoveryScreen} options={{ headerShown: false }} />
            </AuthStack.Group>
        </AuthStack.Navigator>
    );
};
