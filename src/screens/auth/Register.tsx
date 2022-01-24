import React from 'react';
import { ScrollView } from 'react-native';
import { View, Text } from 'react-native-ui-lib';

export const Register: React.FC = () => {
  return (
    <View flex bg-white>
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View padding-s4>
          <Text>Register</Text>
        </View>
      </ScrollView>
    </View>
  );
};
