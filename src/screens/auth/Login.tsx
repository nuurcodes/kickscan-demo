import React from 'react';
import { ScrollView } from 'react-native';
import { View, Text } from 'react-native-ui-lib';

export const Login: React.FC = () => {
  return (
    <View flex bg-white>
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View padding-s4>
          <Text>Login</Text>
        </View>
      </ScrollView>
    </View>
  );
};
