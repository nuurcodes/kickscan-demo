import React, { FC, useEffect } from 'react';
import { Icon } from '@components/icons';
import { Barcode } from '@models/Barcode';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import {
  Button,
  Colors,
  ExpandableSection,
  Keyboard,
  TextField,
  Text,
  View,
  Image,
} from 'react-native-ui-lib';

type Props = {
  lastScanned: Barcode | string | null;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
};

export const AnimatedOverlay: FC<Props> = React.memo(({ lastScanned, expanded, setExpanded }) => {
  const bottom = useSharedValue(-200);

  useEffect(() => {
    if (lastScanned) {
      bottom.value = withTiming(0, { duration: 300 });
    }
  }, [lastScanned]);

  const reanimatedOverlayStyle = useAnimatedStyle(() => {
    return {
      bottom: bottom.value,
    };
  });

  const getHeaderElement = () => {
    if (typeof lastScanned === 'string') {
      return (
        <View row spread centerV>
          <View>
            <Text>Barcode {lastScanned} not found</Text>
          </View>
          <View flex right>
            <Icon
              size={24}
              color={Colors.grey40}
              name={expanded ? 'chevron-down-outline' : 'chevron-up-outline'}
            />
          </View>
        </View>
      );
    }

    return (
      <View row>
        <View marginR-10 centerV>
          <Image
            width={49}
            height={30}
            source={{
              uri: lastScanned?.sku.image_url,
            }}
          />
        </View>
        <View flex row>
          <View>
            <Text text80H uppercase>
              {lastScanned?.sku.name}
            </Text>
            <Text>
              {/* TODO: Stack quantity */}
              {lastScanned?.size_region} {lastScanned?.size} x 1
            </Text>
          </View>
          <View flex right>
            <Icon
              size={24}
              color={Colors.grey40}
              name={expanded ? 'chevron-down-outline' : 'chevron-up-outline'}
            />
          </View>
        </View>
      </View>
    );
  };

  // TODO: Add form
  const getBodyElement = () => {
    if (typeof lastScanned === 'string') {
      return (
        <View paddingT-20>
          <Text>Add item manually form</Text>
        </View>
      );
    }

    return (
      <View paddingT-20>
        <TextField
          migrate
          value='1'
          label='Update quantity'
          keyboardType='numeric'
          fieldStyle={{
            backgroundColor: Colors.grey70,
            borderRadius: 2,
            padding: 12,
            marginBottom: 16,
          }}
        />
        <View row spread>
          <Button label='Remove' outline flex borderRadius={3} />
          <View marginH-8 />
          <Button label='Update' flex borderRadius={3} />
        </View>
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: 16,
          right: 16,
        },
        reanimatedOverlayStyle,
      ]}
    >
      <Keyboard.KeyboardTrackingView>
        <View
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 8,
          }}
        >
          <ExpandableSection
            top={false}
            expanded={expanded}
            sectionHeader={getHeaderElement()}
            onPress={() => setExpanded(!expanded)}
          >
            {getBodyElement()}
          </ExpandableSection>
        </View>
      </Keyboard.KeyboardTrackingView>
    </Animated.View>
  );
});
