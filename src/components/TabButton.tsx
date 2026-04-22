import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

type TabButtonProps = {
  label: string;
  isActive: boolean;
  onPress: () => void;
};

export default function TabButton({
  label,
  isActive,
  onPress,
}: TabButtonProps) {
  const { colors } = useApp();

  return (
    <TouchableOpacity
      style={[
        styles.tabButton,
        isActive && { backgroundColor: colors.tabActiveBg },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.tabText,
          { color: colors.tabText },
          isActive && { color: colors.tabTextActive },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
  },
});