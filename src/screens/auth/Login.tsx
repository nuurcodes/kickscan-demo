import React, { useState } from 'react';
import { signIn } from '@services/auth';
import { ScrollView } from 'react-native';
import { View, Text, TextField, Button } from 'react-native-ui-lib';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View flex bg-white>
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View padding-s4>
          <Text>Login</Text>
          <TextField value={email} onChangeText={setEmail} />
          <TextField value={password} secureTextEntry onChangeText={setPassword} />
          <Button label='LOGIN' onPress={() => signIn(email, password)} />
        </View>
      </ScrollView>
    </View>
  );
};
