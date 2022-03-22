import React, { useEffect, useRef, useState } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { StyleSheet, Dimensions } from 'react-native';
import { ScreenProps } from '@screens/index';
import { View, Text, Button } from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarcodeFormat, useScanBarcodes } from 'vision-camera-code-scanner';
import { AnimatedBarcodeRegion } from '@components/AnimatedBarcodeRegion';
import { AnimatedOverlay } from '@components/AnimatedOverlay';
import { getSneaker } from '@services/sneaker';
import { Barcode } from '@models/Barcode';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

type Props = NativeStackScreenProps<ScreenProps, 'Example'>;

export const Scan: React.FC<Props> = ({ navigation }) => {
  const devices = useCameraDevices();
  const device = devices.back;
  const cameraRef = useRef<Camera | null>(null);
  const deviceScale = Dimensions.get('screen').scale;

  const [scannedBarcodes, setScannedBarcodes] = useState<string[]>([]);
  const [lastScanned, setLastScanned] = useState<Barcode | string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const intensity = useSharedValue(0);

  useEffect(() => {
    if (expanded) {
      intensity.value = withTiming(100, { duration: 300 });
    } else {
      intensity.value = withTiming(0, { duration: 300 });
    }
  }, [expanded]);

  const [frameProcessor, barcodes] = useScanBarcodes([
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
  ]);

  const scanDelay = 1000;
  const lastScanTimestampRef = useRef(0);

  useEffect(() => {
    if (expanded) {
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

      lastScanTimestampRef.current = new Date().getTime();

      getSneaker(value!)
        .then((data) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setScannedBarcodes(scannedBarcodes.concat([value!]));
          setLastScanned(data);
        })
        .catch(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setLastScanned(value!);
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
        <BlurView style={{ flex: 1 }} intensity={intensity.value}>
          <SafeAreaView style={{ flex: 1 }}>
            <View
              padding-s4
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <AnimatedBarcodeRegion expanded={expanded} />
              <View style={{ position: 'absolute', top: 0, right: 16 }}>
                <Button
                  label={`(${scannedBarcodes.length}) done`}
                  onPress={() => navigation.pop()}
                />
              </View>
              <AnimatedOverlay
                expanded={expanded}
                lastScanned={lastScanned}
                setExpanded={setExpanded}
              />
            </View>
          </SafeAreaView>
        </BlurView>
      </Camera>
    </View>
  );
};
