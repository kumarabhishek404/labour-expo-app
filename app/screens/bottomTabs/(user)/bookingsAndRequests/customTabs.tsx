import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import React from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import {
  SegmentedButtons,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

type ButtonOption = {
  value: string;
  label: string;
  count?: number;
  loading?: boolean; // Add loading state for each button
  checkedColor?: string;
  uncheckedColor?: string;
};

type Props = {
  buttons: ButtonOption[];
  selectedTab?: string;
  onValueChange?: (value: string) => void;
  selectedColor?: string;
  unselectedColor?: string;
  selectedBorderColor?: string;
  unselectedBorderColor?: string;
};

const CustomSegmentedButton = ({
  buttons,
  selectedTab = "",
  onValueChange,
  selectedColor = Colors.white,
  unselectedColor = Colors.primary,
  selectedBorderColor = Colors.fourth,
  unselectedBorderColor = Colors.primary,
}: Props) => {
  const theme = useTheme();
  const animationValue = useSharedValue(0); // Control color transition

  const handleChange = (selectedValue: string) => {
    animationValue.value = withTiming(1, { duration: 300 }); // Smooth transition for color change

    if (onValueChange) {
      onValueChange(selectedValue);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: animationValue.value ? selectedColor : unselectedColor, // Background color transition
    borderColor: animationValue.value
      ? selectedBorderColor
      : unselectedBorderColor, // Border color transition
    transform: [{ scale: animationValue.value ? 1.05 : 1 }], // Slight scale-up on selection
  }));

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={selectedTab}
        onValueChange={handleChange}
        buttons={buttons?.map((button: ButtonOption) => {
          const isSelected = selectedTab === button.value;

          return {
            ...button,
            checkedColor: selectedColor,
            uncheckedColor: unselectedColor,
            style: [
              styles.button,
              isSelected
                ? { borderColor: selectedBorderColor }
                : { borderColor: unselectedBorderColor },
              animatedStyle, // Apply the animated styles here
            ],
            label: (
              <View style={styles.labelContainer}>
                {button.loading ? (
                  <ActivityIndicator size={20} color={selectedColor} />
                ) : (
                  <Text
                    style={[
                      styles.labelText,
                      isSelected && { color: selectedColor },
                      !isSelected && { color: unselectedColor },
                    ]}
                  >
                    {t(button.label)}
                  </Text>
                )}
              </View>
            ),
          };
        })}
        style={styles.segmentedButton}
        theme={{
          colors: {
            secondaryContainer: Colors.primary,
          },
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    alignItems: "center",
    marginBottom: 4,
  },
  segmentedButton: {
    borderRadius: 30,
  },
  button: {
    borderWidth: 2,
    borderRadius: 30,
    margin: 4,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.primary,
    flexWrap: "wrap", // Allow wrapping of text
    overflow: "visible", // Ensure text doesn't get clipped
  },
});

export default CustomSegmentedButton;
