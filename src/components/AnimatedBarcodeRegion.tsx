import React, { FC, useEffect } from 'react';
import { View } from 'react-native-ui-lib';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export const AnimatedBarcodeRegion: FC = () => {
  const top = useSharedValue(0);
  const opacity = useSharedValue(1);

  const reanimatedTopBarStyle = useAnimatedStyle(() => {
    return {
      top: top.value,
      opacity: opacity.value,
    };
  });

  const reanimatedBottomBarStyle = useAnimatedStyle(() => {
    return {
      top: top.value * -1,
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    top.value = withRepeat(withTiming(30, { duration: 700 }), -1, true);
    opacity.value = withRepeat(withTiming(0, { duration: 700 }), -1, true);
  }, []);

  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.4)',
        height: 4,
      }}
    >
      <View
        style={{
          width: '22%',
          height: '100%',
          backgroundColor: 'rgba(255,255,255,1)',
          position: 'absolute',
        }}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            height: 4,
            width: '22%',
            backgroundColor: 'white',
          },
          reanimatedTopBarStyle,
        ]}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            height: 4,
            width: '22%',
            backgroundColor: 'white',
          },
          reanimatedBottomBarStyle,
        ]}
      />
    </View>
  );
};
