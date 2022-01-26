import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, Vibration, Alert } from 'react-native';
import { ScreenProps } from '@screens/index';
import { View, Text, Button } from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarcodeFormat, useScanBarcodes } from 'vision-camera-code-scanner';
import { AnimatedBarcodeRegion } from '@components/AnimatedBarcodeRegion';
import { getSneaker } from '@services/sneaker';

type Props = NativeStackScreenProps<ScreenProps, 'Example'>;

export const Scan: React.FC<Props> = ({ navigation }) => {
  const devices = useCameraDevices();
  const device = devices.back;
  const cameraRef = useRef<Camera | null>(null);
  const deviceScale = Dimensions.get('screen').scale;

  const [scannedBarcodes, setScannedBarcodes] = useState<string[]>([]);

  const [frameProcessor, barcodes] = useScanBarcodes([
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
  ]);

  const scanDelay = 1000;
  const lastScanTimestampRef = useRef(0);
  const alertOpenRef = useRef(false);

  useEffect(() => {
    if (alertOpenRef.current === true) {
      return;
    }

    if (new Date().getTime() < lastScanTimestampRef.current + scanDelay) {
      return;
    }

    if (barcodes.length > 0 && barcodes[0].rawValue) {
      const barcode = barcodes[0];
      const value = barcode.rawValue;

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

      Vibration.vibrate();
      lastScanTimestampRef.current = new Date().getTime();

      getSneaker(value!)
        .then((data) => {
          setScannedBarcodes(scannedBarcodes.concat([value!]));
          Vibration.vibrate();

          alertOpenRef.current = true;
          Alert.alert(data?.sku.name ?? '', 'Sneaker found', [
            {
              text: 'Continue',
              onPress: () => {
                alertOpenRef.current = false;
              },
              style: 'default',
            },
          ]);
        })
        .catch(() => {
          alertOpenRef.current = true;
          Alert.alert('Error', 'Sneaker not found in database', [
            {
              text: 'Skip',
              onPress: () => {
                alertOpenRef.current = false;
              },
              style: 'cancel',
            },
          ]);
        });
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
        frameProcessor={frameProcessor}
        frameProcessorFps={60}
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
