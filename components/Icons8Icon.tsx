import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

/**
 * Icons8 Icon Component
 *
 * Wrapper for Icons8 icons using their CDN URLs
 * Platform options: ios7, ios11, ios_filled, fluent-systems-regular, color, etc.
 *
 * Common icon IDs from Icons8:
 * - Dog Paw: "2743" (ios7), "9201" (ios_filled)
 * - Walking: "2244" (ios7), "61041" (ios11)
 * - Chat Message: "118377" (ios7), "118374" (ios_filled)
 * - Calendar: "37979" (ios7), "39007" (ios_filled)
 * - Profile: "7823" (ios7), "7821" (ios_filled)
 * - Map Pin: "41445" (ios7), "43731" (ios_filled)
 * - Star: "39070" (ios7), "37974" (ios_filled)
 * - Search: "132" (ios7)
 */

interface Icons8IconProps {
  iconId: string;
  size?: number;
  color?: string;
  platform?: string;
  style?: StyleProp<ImageStyle>;
}

export function Icons8Icon({
  iconId,
  size = 24,
  color = "000000",
  platform = "ios7",
  style,
}: Icons8IconProps) {
  // Remove # from color if present
  const cleanColor = color.replace("#", "");

  // Icons8 CDN URL format
  const url = `https://img.icons8.com/${platform}/${size}/${cleanColor}/${iconId}.png`;

  return (
    <Image
      source={{ uri: url }}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
      resizeMode="contain"
    />
  );
}

// Pre-configured icon components for common use cases
export const Icons8DogPaw = (props: Omit<Icons8IconProps, "iconId">) => (
  <Icons8Icon iconId="2743" {...props} />
);

export const Icons8Walking = (props: Omit<Icons8IconProps, "iconId">) => (
  <Icons8Icon iconId="2244" {...props} />
);

export const Icons8Chat = (props: Omit<Icons8IconProps, "iconId">) => (
  <Icons8Icon iconId="118377" {...props} />
);

export const Icons8Calendar = (props: Omit<Icons8IconProps, "iconId">) => (
  <Icons8Icon iconId="37979" {...props} />
);

export const Icons8Profile = (props: Omit<Icons8IconProps, "iconId">) => (
  <Icons8Icon iconId="7823" {...props} />
);

export const Icons8MapPin = (props: Omit<Icons8IconProps, "iconId">) => (
  <Icons8Icon iconId="41445" {...props} />
);

export const Icons8Star = (props: Omit<Icons8IconProps, "iconId">) => (
  <Icons8Icon iconId="39070" {...props} />
);

export const Icons8Search = (props: Omit<Icons8IconProps, "iconId">) => (
  <Icons8Icon iconId="132" {...props} />
);
