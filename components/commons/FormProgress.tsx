import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";

interface Props {
  currentStep: number;
}

const steps = [
  { label: "workType" }, // 1
  { label: "workSubType" }, // 2
  { label: "workersNeeded" }, // 3
  { label: "location" }, // 4
  { label: "details" }, // 5
  { label: "facilities" }, // 6
  { label: "photos" }, // 7
  { label: "review" }, // 8
];

export default function FormProgressBar({ currentStep }: Props) {
  const progressPercent = Math.round((currentStep / steps.length) * 100);

  return (
    <View style={styles.container}>
      {/* Top text */}
      <Text style={styles.progressText}>
        {t("step")} {currentStep} / {steps.length} • {progressPercent}%{" "}
        {t("completed")}
      </Text>

      {/* Bar */}
      <View style={styles.row}>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const completed = stepNumber < currentStep;
          const active = stepNumber === currentStep;

          return (
            <View key={index} style={styles.stepContainer}>
              {/* Line */}
              {index !== 0 && (
                <View
                  style={[
                    styles.line,
                    completed && { backgroundColor: Colors.primary },
                  ]}
                />
              )}

              {/* Circle */}
              <View
                style={[
                  styles.circle,
                  completed && styles.completedCircle,
                  active && styles.activeCircle,
                ]}
              >
                <Text style={styles.circleText}>{stepNumber}</Text>
              </View>

              {/* Label */}
              {/* <Text
                style={[
                  styles.label,
                  active && { color: Colors.primary, fontWeight: "700" },
                ]}
              >
                {t(step.label)}
              </Text> */}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginBottom: 15,
  },

  progressText: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
    color: "#FFF",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  stepContainer: {
    alignItems: "center",
    flex: 1,
  },

  line: {
    position: "absolute",
    top: 14,
    left: -25,
    width: 50,
    height: 3,
    backgroundColor: "#ddd",
    zIndex: -1,
  },

  circle: {
    width: 28,
    height: 28,
    borderRadius: 20,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },

  activeCircle: {
    backgroundColor: Colors.highlight,
    transform: [{ scale: 1.15 }],
  },

  completedCircle: {
    backgroundColor: "#22c55e",
  },

  circleText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },

  label: {
    fontSize: 10,
    marginTop: 4,
    textAlign: "center",
    color: "#FFF",
  },
});
