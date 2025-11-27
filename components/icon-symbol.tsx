// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'person.fill': 'person',
  'figure.walk': 'directions-walk',
  'dollarsign.circle.fill': 'attach-money',
  'person.crop.circle.fill': 'account-circle',
} as const satisfies Record<string, ComponentProps<typeof MaterialIcons>['name']>;

type IconSymbolName = keyof typeof MAPPING;

/**
 * Type-safe accessor for icon mapping with runtime validation.
 * Prevents Generic Object Injection Sink security issues.
 */
const getMappedIcon = (name: IconSymbolName): ComponentProps<typeof MaterialIcons>['name'] => {
  const icon = MAPPING[name];
  if (!icon) {
    console.warn(`Icon mapping not found for: ${name}`);
    return 'help-outline'; // fallback icon
  }
  return icon;
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={getMappedIcon(name)} style={style} />;
}
