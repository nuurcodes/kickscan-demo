import React from 'react';
import { ScrollView } from 'react-native';
import { View, Text } from 'react-native-ui-lib';

export const Main: React.FC = () => {
  return (
    <View flex bg-white>
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View padding-s4>
          <Text>Home</Text>
        </View>
      </ScrollView>
    </View>
  );
};
