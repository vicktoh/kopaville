import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { JobStackParamList, MarketStackParamList } from '../types';
import { JoblistScreen } from '../screens/JoblistScreen';
import { AddBusinessScreen } from '../screens/AddBusinessScreen';
import { AddJobScreen } from '../screens/AddJobScreen';
import { JobDetailsScreen } from '../screens/JobDetailsScreen';
import { ExploreMarket } from '../screens/ExploreMarket';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { CartScreen } from '../screens/CartScreen';

const MarketStack = createNativeStackNavigator<MarketStackParamList>();

export const MarketNavigation = () => {
    return (
        <MarketStack.Navigator initialRouteName="Market">
            <MarketStack.Group>
                <MarketStack.Screen
                    name="Market"
                    component={ExploreMarket}
                    options={{headerShown: false}}
                />

                <MarketStack.Screen
                    name="Product Detail"
                    component={ProductDetailsScreen}
                    options={{ headerShown: false }}
                />
            </MarketStack.Group>
            <MarketStack.Group screenOptions={{ presentation: 'modal' }}>
                <MarketStack.Screen
                    name="Cart"
                    component={CartScreen}
                    options={{ headerShown: false }}
                />
            </MarketStack.Group>
        </MarketStack.Navigator>
    );
};
