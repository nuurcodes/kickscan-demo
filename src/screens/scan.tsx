import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, Vibration } from 'react-native';
import { ScreenProps } from '@screens/index';
import { View, Text, Button } from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarcodeFormat, useScanBarcodes } from 'vision-camera-code-scanner';
import { AnimatedBarcodeRegion } from '@components/AnimatedBarcodeRegion';

type Props = NativeStackScreenProps<ScreenProps, 'Example'>;

export const Scan: React.FC<Props> = ({ navigation }) => {
  const devices = useCameraDevices();
  const device = devices.back;
  const cameraRef = useRef<Camera | null>(null);
  const [scannedBarcodes, setScannedBarcodes] = useState<string[]>([]);
  const [frameProcessorDisabled, setFrameProcessorDisable] = useState(false);

  const [frameProcessorEmpty] = useScanBarcodes([]);
  const [frameProcessor, barcodes] = useScanBarcodes([
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
  ]);

  useEffect(() => {
    if (barcodes.length > 0 && barcodes[0].rawValue) {
      const barcode = barcodes.slice(0, 1)[0];
      const value = barcode.rawValue;

      const deviceScale = Dimensions.get('screen').scale;
      const cornerPointsY = (barcode.cornerPoints ?? []).map(
        (cornerPoint) => cornerPoint.y / deviceScale
      );
      const cornerPointMinY = Math.min(...cornerPointsY);
      const cornerPointMaxY = Math.max(...cornerPointsY);

      // Device height is off by 80 on iPhone X
      const deviceHeight = Dimensions.get('screen').height;
      const deviceMidpoint = deviceHeight / 2 - 80;

      if (!(cornerPointMinY < deviceMidpoint && cornerPointMaxY > deviceMidpoint)) {
        console.log('out of range');
        return;
      }

      setFrameProcessorDisable(true);

      setTimeout(() => {
        setFrameProcessorDisable(false);
      }, 1000);

      setScannedBarcodes(scannedBarcodes.concat([value!]));
      Vibration.vibrate();
    }
  }, [barcodes]);

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
        zoom={1}
        ref={cameraRef}
        isActive={true}
        device={device!}
        style={StyleSheet.absoluteFill}
        frameProcessor={frameProcessorDisabled ? frameProcessorEmpty : frameProcessor}
        frameProcessorFps={30}
      >
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
            <AnimatedBarcodeRegion />
            <View style={{ position: 'absolute', top: 0, right: 16 }}>
              <Button label={`(${scannedBarcodes.length}) done`} onPress={() => navigation.pop()} />
            </View>
          </View>
        </SafeAreaView>
      </Camera>
    </View>
  );
};
