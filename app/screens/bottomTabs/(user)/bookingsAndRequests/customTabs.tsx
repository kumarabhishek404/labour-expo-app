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
  const animationValue = useSharedValue(0);

  const handlePress = (value: string) => {
    animationValue.value = withTiming(1, { duration: 300 });
    setSelected(value);
    if (onValueChange) {
      onValueChange(value);
    }
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
                  {tabCounts && tabCounts[index] ? tabCounts[index] : ""} {" "}
                  {t(button.label)}
                </CustomText>
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
    gap: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 5,
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
