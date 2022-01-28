import React, { FC, useEffect } from 'react';
import { View } from 'react-native-ui-lib';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  expanded: boolean;
};

export const AnimatedBarcodeRegion: FC<Props> = React.memo(({ expanded }) => {
  const top = useSharedValue(0);
  const opacity = useSharedValue(1);
  const generalOpacity = useSharedValue(1);

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

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: generalOpacity.value,
    };
  });

  useEffect(() => {
    top.value = withRepeat(withTiming(30, { duration: 700 }), -1, true);
    opacity.value = withRepeat(withTiming(0, { duration: 700 }), -1, true);
  }, []);

  useEffect(() => {
    if (expanded) {
      generalOpacity.value = withTiming(0, { duration: 350 });
    } else {
      generalOpacity.value = withTiming(1, { duration: 350 });
    }
  }, [expanded]);

  return (
    <Animated.View
      style={[
        {
          width: '100%',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.4)',
          height: 4,
        },
        reanimatedStyle,
      ]}
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
    </Animated.View>
  );
});
