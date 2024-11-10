import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { View, StyleSheet } from "react-native";

interface StepperProps {
  currentStep: number;
  steps: Array<any>;
  // staps?: Step[];
}

const Stepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
  let activeStep = currentStep - 1;

  return (
    <View style={styles.container}>
      {steps?.map((step: any, index: number) => (
        <View key={index} style={styles.stepContainer}>
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
              <Entypo name="check" size={20} color={Colors?.white} />
            )}
            {index === activeStep && (
              <CustomHeading color={Colors?.white}>
                {activeStep + 1}
              </CustomHeading>
            )}
            {index > activeStep && (
              <Entypo name="lock" size={20} color={Colors?.white} />
            )}
          </View>
          <CustomText fontWeight="500" fontSize={10}>
            {t(step.label)}
          </CustomText>
          <CustomText
            fontSize={10}
            fontWeight="600"
            color={
              index < activeStep
                ? Colors?.success
                : index === activeStep
                ? Colors?.primary
                : Colors?.pending
            }
          >
            {index < activeStep
              ? t("completed")
              : index === activeStep
              ? t("inProgress")
              : t("pending")}
          </CustomText>

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
    backgroundColor: Colors?.success,
  },
  inProgressCircle: {
    backgroundColor: Colors?.primary,
  },
  pendingCircle: {
    backgroundColor: Colors?.pending,
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
