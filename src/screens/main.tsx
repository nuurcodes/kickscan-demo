import React from 'react';
import { ScrollView } from 'react-native';
import { View, Text, Button } from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenProps } from '@screens/index';
import { signOut } from '@services/auth';

type Props = NativeStackScreenProps<ScreenProps, 'Main'>;

export const Main: React.FC<Props> = ({ navigation }) => {
  return (
    <View flex bg-white>
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View padding-s4>
          <Text>Home</Text>
          <Button onPress={() => navigation.navigate('ScanModal')} label='SCAN BARCODE' />
          <Button
            onPress={() => navigation.navigate('ScanTrackingModal')}
            label='SCAN TRACKING'
            style={{ marginTop: 8 }}
          />
          <Button onPress={() => signOut()} label='LOGOUT' style={{ marginTop: 8 }} />
        </View>
      </ScrollView>
    </View>
  );
};
