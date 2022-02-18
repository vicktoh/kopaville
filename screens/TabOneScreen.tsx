import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { View } from '../components/Themed';
import {Text} from 'native-base';
import { RootTabScreenProps } from '../types';
import { useAppDispatch } from '../hooks/redux';
import { Button } from 'native-base';
import { logOut } from '../services/authServices';
import { removeLocalData } from '../services/local';
import { LOCAL_USER_INFO } from '../constants/Storage';
import { setAuth } from '../reducers/authSlice';
import { FirebaseError } from 'firebase/app';
import { ErrorDict } from '../constants/Firebase';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const dispatch = useAppDispatch();


  const onLogOut = async()=>{
    try {
       logOut();
       removeLocalData(LOCAL_USER_INFO);
       dispatch(setAuth(null));
    } catch (error) {
      if (error instanceof FirebaseError) {
        return {
            status: 'failed',
            message: ErrorDict[error.code] || "Unexpected error try again",
        };
    }
    }
  }
  return (
    <View style={styles.container}>
      <Button onPress={onLogOut}>Log out</Button>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
