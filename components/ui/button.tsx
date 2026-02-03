import type { TouchableOpacityProps } from "react-native";
import { Text, TouchableOpacity } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  color?: string;
  textColor?: string;
}

export function Button({
  title,
  variant = "primary",
  color,
  textColor,
  className = "",
  ...props
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          containerClass: `rounded-full py-4 ${className}`,
          textClass: "text-white text-lg font-semibold text-center",
          backgroundColor: color,
        };
      case "secondary":
        return {
          containerClass: `rounded-full py-4 border-2 ${className}`,
          textClass: "text-lg font-semibold text-center",
          backgroundColor: "transparent",
          borderColor: color,
        };
      case "outline":
        return {
          containerClass: `rounded-xl py-3 border ${className}`,
          textClass: "text-center font-semibold",
          backgroundColor: "transparent",
          borderColor: color,
        };
      default:
        return {
          containerClass: `rounded-full py-4 ${className}`,
          textClass: "text-white text-lg font-semibold text-center",
          backgroundColor: color,
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <TouchableOpacity
      className={styles.containerClass}
      style={{
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
      }}
      activeOpacity={0.8}
      {...props}
    >
      <Text
        className={styles.textClass}
        style={{ color: textColor || (variant === "primary" ? "#fff" : color) }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
