import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { t } from "@/utils/translationHelper";
import Colors from "@/constants/Colors";
import CustomText from "@/components/commons/CustomText";

type ButtonOption = {
  value: string;
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  loading?: boolean;
};

type Props = {
  buttons: ButtonOption[];
  selectedTab?: string;
  onValueChange?: (value: string) => void;
};

const CustomSegmentedButton = ({
  buttons,
  selectedTab = "",
  onValueChange,
}: Props) => {
  const [selected, setSelected] = useState(selectedTab);
  const animationValue = useSharedValue(0);

  const handlePress = (value: string) => {
    animationValue.value = withTiming(1, { duration: 300 });
    setSelected(value);
    onValueChange && onValueChange(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.segmentedContainer}>
        {buttons.map((button, index) => {
          const isSelected = selected === button.value;
          const isFirst = index === 0;
          const isLast = index === buttons.length - 1;

          return (
            <TouchableOpacity
              key={button.value}
              style={[
                styles.button,
                isFirst && styles.firstButton,
                isLast && styles.lastButton,
                !isFirst && !isLast && styles.middleButton,
                isSelected && styles.selectedButton,
                isFirst ? { borderRightWidth: 0 } : { borderLeftWidth: 0 },
              ]}
              onPress={() => handlePress(button.value)}
            >
              <Animated.View style={[styles.buttonContent]}>
                {button.loading && (
                  <ActivityIndicator
                    size="small"
                    color={
                      isSelected
                        ? Colors.tertieryButtonText
                        : Colors.tertieryButton
                    }
                  />
                )}
                {button.icon && (
                  <MaterialIcons
                    name={button.icon}
                    size={20}
                    color={
                      isSelected
                        ? Colors.tertieryButtonText
                        : Colors.tertieryButton
                    }
                  />
                )}
                <CustomText
                  baseFont={15}
                  fontWeight="500"
                  color={
                    isSelected
                      ? Colors?.tertieryButtonText
                      : Colors?.tertieryButton
                  }
                >
                  {t(button.label)}
                </CustomText>
                {button?.count && (
                  <View
                    style={[
                      styles?.countCircle,
                      {
                        backgroundColor: isSelected
                          ? Colors?.tertieryButtonText
                          : Colors?.tertieryButton,
                      },
                    ]}
                  >
                    <CustomText
                      baseFont={16}
                      fontWeight="500"
                      color={
                        isSelected
                          ? Colors?.tertieryButton
                          : Colors?.tertieryButtonText
                      }
                    >
                      {button?.count}
                    </CustomText>
                  </View>
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 10,
  },
  segmentedContainer: {
    flexDirection: "row",
  },
  button: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4, // Add space between buttons
    borderWidth: 1.5,
    borderColor: Colors.tertieryButton,
  },
  firstButton: {
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },
  lastButton: {
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  middleButton: {
    borderRadius: 0, // No rounded edges for middle buttons
  },
  selectedButton: {
    backgroundColor: Colors?.tertiery,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  label: {},
  countCircle: {
    minWidth: 28,
    minHeight: 28,
    padding: 3,
    borderRadius: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomSegmentedButton;
