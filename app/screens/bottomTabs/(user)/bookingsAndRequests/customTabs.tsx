import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  tabCounts?: any;
  selectedTab?: string;
  onValueChange?: (value: string) => void;
};

const CustomSegmentedButton = ({
  buttons,
  tabCounts,
  selectedTab = "",
  onValueChange,
}: Props) => {
  const [selected, setSelected] = useState(selectedTab);

  // 🔹 Animated values for each button
  const animations = useRef(
    buttons.map(() => new Animated.Value(1)), // default scale = 1
  ).current;

  const handlePress = (value: string, index: number) => {
    // Animate button press (scale down then up)
    Animated.sequence([
      Animated.timing(animations[index], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animations[index], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setSelected(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.segmentedContainer}>
        {buttons.map((button, index) => {
          const isSelected = selected === button.value;
          const isFirst = index === 0;
          const isLast = index === buttons.length - 1;

          return (
            <TouchableOpacity
              key={button.value}
              activeOpacity={0.8}
              onPress={() => handlePress(button.value, index)}
              style={[
                styles.button,
                isFirst && styles.firstButton,
                isLast && styles.lastButton,
                !isFirst && !isLast && styles.middleButton,
                isSelected && styles.selectedButton,
                isFirst ? { borderRightWidth: 0 } : { borderLeftWidth: 0 },
              ]}
            >
              {/* 🔹 Animated scale on press */}
              <Animated.View
                style={[
                  styles.buttonContent,
                  { transform: [{ scale: animations[index] }] },
                ]}
              >
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
                  {tabCounts && tabCounts[index] ? tabCounts[index] : ""}{" "}
                  {t(button.label)}
                </CustomText>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    paddingVertical: 10,
  },
  segmentedContainer: {
    flexDirection: "row",
    gap: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
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
    borderRadius: 0,
  },
  selectedButton: {
    backgroundColor: Colors?.tertiery,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});

export default CustomSegmentedButton;
