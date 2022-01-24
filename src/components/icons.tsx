import React, { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Colors, ViewProps } from 'react-native-ui-lib';

type IconProps = {
  name: any;
  size?: number;
  color?: string;
  viewProps?: ViewProps;
};

const ICON_SIZE = 26;

export const IconComponent = Ionicons;
export const Icon: React.FC<IconProps> = ({
  name,
  size = ICON_SIZE,
  color = Colors.textColor,
  viewProps,
}: IconProps) => {
  const Icon = useMemo(
    () => (
      <View {...viewProps}>
        <IconComponent name={name} size={size} color={color} />
      </View>
    ),
    [viewProps, name, size, color]
  );

  return Icon;
};
