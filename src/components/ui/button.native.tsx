import * as React from "react";
import {
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "items-center justify-center gap-2 rounded-md disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary",
        destructive: "bg-destructive",
        outline: "border bg-background",
        secondary: "bg-secondary",
        transparent: "border",
        ghost: "",
        link: "",
      },
      size: {
        default: "min-h-9 px-4 py-2",
        sm: "min-h-8 px-3 py-1.5",
        lg: "min-h-10 px-6 py-3",
        icon: "h-9 w-9 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type NativeButtonBaseProps = Omit<TouchableOpacityProps, "onPress"> & {
  children: React.ReactNode;
  className?: string;
  onPress?: (event: GestureResponderEvent) => void;
};

export interface ButtonProps
  extends NativeButtonBaseProps,
    VariantProps<typeof buttonVariants> {}

function Button({
  children,
  className,
  variant,
  size,
  onPress,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={cn(buttonVariants({ variant, size, className }))}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className="text-center">{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

export { Button, buttonVariants };
