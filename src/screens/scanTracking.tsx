import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, Vibration, Alert } from 'react-native';
import { ScreenProps } from '@screens/index';
import { View, Text, Button } from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarcodeFormat, useScanBarcodes } from 'vision-camera-code-scanner';
import { AnimatedBarcodeRegion } from '@components/AnimatedBarcodeRegion';
import { supabase } from '@lib/supabase';

type Props = NativeStackScreenProps<ScreenProps, 'Example'>;

// TODO: Remove this screen
export const ScanTracking: React.FC<Props> = ({ navigation }) => {
  const devices = useCameraDevices();
  const device = devices.back;
  const cameraRef = useRef<Camera | null>(null);
  const deviceScale = Dimensions.get('screen').scale;

  const [scannedBarcodes, setScannedBarcodes] = useState<string[]>([]);

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.CODE_128]);

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

      let barcodeValue = barcode.rawValue ?? '';

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

      if (barcodeValue.includes(' ')) {
        const secondPart = barcodeValue.split(' ')[1];
        barcodeValue = secondPart.substring(1, secondPart.length - 3);
      }

      const isDuplicateBarcode = scannedBarcodes.includes(barcodeValue);

      if (isDuplicateBarcode) {
        alertOpenRef.current = true;
        Alert.alert('Error', 'Barcode already scanned', [
          {
            text: 'Close',
            onPress: () => {
              alertOpenRef.current = false;
            },
            style: 'cancel',
          },
        ]);
      } else {
        Vibration.vibrate();
        lastScanTimestampRef.current = new Date().getTime();
        setScannedBarcodes(scannedBarcodes.concat([barcodeValue!]));
      }
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
            <AnimatedBarcodeRegion expanded={false} />
            <View style={{ position: 'absolute', top: 0, right: 16 }}>
              <Button
                label={`(${scannedBarcodes.length}) done`}
                onPress={async () => {
                  // TODO: Mutation
                  const { error } = await supabase
                    .from('abdul_parcels')
                    .upsert(scannedBarcodes.map((bc) => ({ barcode: bc })));
                  if (error) {
                    Alert.alert('Failed to upload data');
                  } else {
                    navigation.pop();
                  }
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </Camera>
    </View>
  );
};
