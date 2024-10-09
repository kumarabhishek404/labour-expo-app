
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import Step1 from "../../../assets/step1.jpg";
import { useAtom } from "jotai";
import { AddServiceAtom, AddServiceInProcess } from "@/app/AtomStore/user";
import TextInputComponent from "@/components/TextInputWithIcon";
import Button from "@/components/Button";
import { toast } from "@/app/hooks/toast";

interface WorkInfoProps {}

const Final: React.FC<WorkInfoProps> = () => {
  const [isAddService, setIsAddService] = useAtom(AddServiceInProcess);

  const handleFinish = () => {
    setIsAddService(false);
    router?.push("/(tabs)/bookings");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.box}>
        <View style={styles?.formContainer}>
          <Image source={Step1} style={styles.image} />
          <Text style={styles?.headerText}>Service Added Successfully</Text>
        </View>

        <View style={styles?.buttonContainer}>
          <Button isPrimary={true} title="Home" onPress={handleFinish} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "white",
  },
  box: {
    padding: 20,
    justifyContent: "space-between",
    height: 700,
  },
  customHeader: {
    width: "100%",
    paddingHorizontal: 20,
  },
  headerText: {
    fontWeight: "700",
    fontSize: 30,
    color: "green",
    textAlign: "center",
    marginVertical: 40,
  },
  formContainer: {},
  image: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
  },
  buttonContainer: {
    backgroundColor: Colors?.primary,
    borderRadius: 4,
    marginBottom: 60,
  },
  buttonText: {
    color: Colors?.white,
    fontWeight: "700",
    textAlign: "center",
    fontSize: 18,
  },
});

export default Final;
