import React from 'react';
import { Pressable, Text, View, ViewStyle, TextStyle } from 'react-native';
import { cn } from '../utils/cn';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function Button({
  children,
  onPress,
  disabled,
  variant = 'default',
  size = 'default',
  className,
}: ButtonProps) {
  const baseStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  };

  const variants: Record<string, ViewStyle> = {
    default: {
      backgroundColor: '#2563eb',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#3f3f46',
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    destructive: {
      backgroundColor: '#dc2626',
    },
  };

  const sizes: Record<string, ViewStyle> = {
    default: {
      height: 36,
      paddingHorizontal: 16,
    },
    sm: {
      height: 32,
      paddingHorizontal: 12,
    },
    lg: {
      height: 40,
      paddingHorizontal: 24,
    },
    icon: {
      height: 36,
      width: 36,
    },
  };

  const textStyle: TextStyle = {
    color: variant === 'outline' || variant === 'ghost' ? '#ffffff' : '#ffffff',
    fontSize: size === 'lg' ? 16 : 14,
    fontWeight: '600',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        baseStyle,
        variants[variant],
        sizes[size],
        { opacity: disabled ? 0.5 : pressed ? 0.8 : 1 },
        className ? {} : {},
      ]}
      className={cn('gap-2', className)}
    >
      {typeof children === 'string' ? (
        <Text style={textStyle}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
