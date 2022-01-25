import React, { useEffect, useRef } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { ScreenProps } from '@screens/index';
import { View, Text, Button } from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

type Props = NativeStackScreenProps<ScreenProps, 'Example'>;

export const Scan: React.FC<Props> = ({ navigation }) => {
  const devices = useCameraDevices();
  const device = devices.back;
  const cameraRef = useRef<Camera | null>(null);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.focus({
        x: Dimensions.get('window').width / 2,
        y: Dimensions.get('window').height / 2,
      });
    }
  }, [cameraRef.current]);

  if (device == null) return <Text>No device</Text>;

  return (
    <View flex bg-white>
      <Camera
        zoom={1.5}
        ref={cameraRef}
        isActive={true}
        device={device!}
        style={StyleSheet.absoluteFill}
      >
        <BlurView intensity={0} style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <View
              padding-s4
              style={{
                flexGrow: 1,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* TODO: Add scan icon */}
              <View>
                <Text>+</Text>
              </View>
              <View style={{ position: 'absolute', top: 0, right: 16 }}>
                <Button label='close' onPress={() => navigation.pop()} />
              </View>
            </View>
          </SafeAreaView>
        </BlurView>
      </Camera>
    </View>
  );
};
