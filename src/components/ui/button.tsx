import * as React from "react";
import {
  GestureResponderEvent,
  Platform,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline:
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        transparent:
          "border hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 py-1.5",
        lg: "h-10 px-6 py-3",
        icon: "h-9 w-9 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type NativeButtonBaseProps = Omit<TouchableOpacityProps, "onPress" | "children"> & {
  children: React.ReactNode;
  className?: string;
  onPress?: (event: GestureResponderEvent) => void;
  onClick?: (event: GestureResponderEvent) => void;
  type?: "button" | "submit" | "reset";
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
  onClick,
  disabled,
  ...props
}: ButtonProps) {
  const handlePress = onPress ?? onClick;

  if (Platform.OS === "web") {
    return (
      <button
        type="button"
        className={cn(buttonVariants({ variant, size, className }))}
        onClick={handlePress as unknown as React.MouseEventHandler<HTMLButtonElement>}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }

  return (
    <TouchableOpacity
      className={cn(buttonVariants({ variant, size, className }))}
      onPress={handlePress}
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
