import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

interface Step {
  label: string;
  status: "completed" | "inProgress" | "pending";
}

interface StepperProps {
  currentStep: number;
  steps: Array<any>;
  // steps?: Step[];
}

const Stepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
  let activeStep = currentStep - 1;

  return (
    <View style={styles.container}>
      {steps.map((step: any, index: number) => (
        <View key={index} style={styles.stepContainer}>
          {/* Icon */}
          <View
            style={[
              styles.circle,
              index < activeStep
                ? styles.completedCircle
                : index === activeStep
                ? styles.inProgressCircle
                : styles.pendingCircle,
            ]}
          >
            {index < activeStep && (
              <Text style={styles.checkMark}>
                <Entypo name="check" size={20} />
              </Text>
            )}
            {index === activeStep && (
              <Text style={styles.lockIcon}>{activeStep + 1}</Text>
            )}
            {index > activeStep && (
              <Text style={styles.lockIcon}>
                <Entypo name="lock" size={20} />
              </Text>
            )}
          </View>
          <Text style={styles.stepLabel}>{step.label}</Text>
          <Text
            style={[
              styles.statusText,
              index < activeStep
                ? styles.completedText
                : index === activeStep
                ? styles.inProgressText
                : styles.pendingText,
            ]}
          >
            {index < activeStep
              ? "Completed"
              : index === activeStep
              ? "In Progress"
              : "Pending"}
          </Text>

          {/* Line connecting steps */}
          {index < steps.length - 1 && (
            <View style={styles.lineContainer}>
              <View
                style={[
                  styles.line,
                  index < activeStep
                    ? styles.completedLine
                    : styles.pendingLine,
                ]}
              />
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    // paddingVertical: 5,
    // marginTop: 10,
    padding: 0,
  },
  stepContainer: {
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  completedCircle: {
    backgroundColor: "#4CAF50",
  },
  inProgressCircle: {
    backgroundColor: "#2196F3",
  },
  pendingCircle: {
    backgroundColor: "#ccc",
  },
  checkMark: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  lockIcon: {
    color: "white",
    fontSize: 16,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  statusText: {
    fontSize: 10,
    textAlign: "center",
  },
  completedText: {
    color: "#4CAF50",
  },
  inProgressText: {
    color: "#2196F3",
  },
  pendingText: {
    color: "#ccc",
  },
  lineContainer: {
    position: "absolute",
    top: 15,
    right: -20,
    width: 40,
    height: 2,
    zIndex: -1,
  },
  line: {
    flex: 1,
    height: 2,
  },
  completedLine: {
    backgroundColor: "#4CAF50",
  },
  pendingLine: {
    backgroundColor: "#ccc",
  },
});

export default Stepper;
