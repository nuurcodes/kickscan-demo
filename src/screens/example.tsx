import React from 'react';
import { ScrollView } from 'react-native';
import { ScreenProps } from '@screens/index';
import { View, Text } from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<ScreenProps, 'Example'>;

export const Example: React.FC<Props> = () => {
  return (
    <View flex bg-white>
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View padding-s4>
          <Text>Example</Text>
        </View>
      </ScrollView>
    </View>
  );
};
