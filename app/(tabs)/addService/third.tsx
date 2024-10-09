import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import Step3 from "../../../assets/step3.jpg";
import WorkRequirment from "@/components/WorkRequirements";
import Animated from "react-native-reanimated";
import Button from "@/components/Button";
import { AddServiceAtom } from "@/app/AtomStore/user";
import { useAtom } from "jotai";
import { toast } from "@/app/hooks/toast";
import Stepper from "./stepper";

interface WorkRequirementsProps {}
const { width } = Dimensions.get("window");

const WorkRequirements: React.FC<WorkRequirementsProps> = () => {
  const [addService, setAddService] = useAtom(AddServiceAtom);
  const [requirements, setRequirements]: any = useState(
    addService?.requirements ?? addService?.jobs[0]?.jobs ?? [
      {
        name: "",
        totalRequired: 0,
        payPerDay: 0,
        foodProvided: false,
        shelterProvider: false,
      },
    ]
  );

  const handleNext = () => {
    console.log("requirements--", requirements);

    if (
      requirements[0]?.name &&
      requirements[0]?.payPerDay &&
      requirements[0]?.totalRequired > 0
    ) {
      setAddService({
        requirements: requirements,
        ...addService,
      });
      router?.push("/(tabs)/addService/fourth");
    } else {
      toast.error("Please fill all the input fields");
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles?.customHeader}>
          <Text style={styles?.headerText}>Add Service</Text>
        </View>
        <Image source={Step3} style={styles.image} />
        <Stepper currentStep={3} />

        <View style={styles?.formContainer}>
          <WorkRequirment
            requirements={requirements}
            setRequirements={setRequirements}
          />
        </View>
      </ScrollView>

      <Animated.View style={styles.footer}>
        <Button isPrimary={false} title="Back" onPress={() => router.back()} />
        <Button isPrimary={true} title="Next" onPress={handleNext} />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "white",
  },
  customHeader: {
    width: "100%",
    paddingHorizontal: 20,
  },
  headerText: {
    // textAlign: 'center',
    fontWeight: "700",
    fontSize: 20,
  },
  formContainer: {
    padding: 20,
    marginBottom: 100,
  },
  image: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
    marginBottom: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    padding: 20,
    paddingBottom: 30,
    width: width,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default WorkRequirements;
