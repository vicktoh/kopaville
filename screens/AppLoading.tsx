import React, { FC } from 'react';
import { View, Text } from '../components/Themed';

import Dimensions from '../constants/Layout';

export const AppLoading: FC = () => {
    const { width, height } = Dimensions.window;
    return (
        <View style={{ width, height }}>
            <Text>KopaVille</Text>
        </View>
    );
};
