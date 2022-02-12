import React, {FC} from "react";
import { createNativeStackNavigator} from "@react-navigation/native-stack"
import { AuthStackParamList } from "../types"
const AuthStack =  createNativeStackNavigator<AuthStackParamList>();
import { LoginScreen } from "../screens/LoginScreen";

export const AuthNavigation = ()=>{
    return(
        <AuthStack.Navigator>
           <AuthStack.Screen name = "Login" component = {LoginScreen} options = {{headerShown: false}}  />
           <AuthStack.Screen name = "Register" component = {LoginScreen}  />
           <AuthStack.Screen name = "Forgot" component={LoginScreen} options={{ headerShown : false}}/>
        </AuthStack.Navigator>
    )
} 