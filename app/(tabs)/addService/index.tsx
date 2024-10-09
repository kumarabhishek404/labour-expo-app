import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import Colors from "@/constants/Colors";
import Step1 from "../../../assets/step1.jpg";
import { useAtom, useAtomValue } from "jotai";
import {
  AddServiceAtom,
  AddServiceInProcess,
  UserAtom,
} from "@/app/AtomStore/user";
import TextInputComponent from "@/components/TextInputWithIcon";
import Button from "@/components/Button";
import { toast } from "@/app/hooks/toast";
import Stepper from "./stepper";

interface WorkInfoProps {}

const WorkInfo: React.FC<WorkInfoProps> = () => {
  const global = useGlobalSearchParams();
  const userDetails = useAtomValue(UserAtom);
  const [isAddService, setIsAddService] = useAtom(AddServiceInProcess);
  const [addService, setAddService] = useAtom(AddServiceAtom);
  const [title, setTitle] = useState<string>(addService?.name ?? "");
  const [description, setDescription] = useState<string>(
    addService?.description ?? ""
  );

  // console.log("User Details--- params", addService);

  const handleNext = () => {
    if (title && description) {
      setAddService({
        name: title,
        description: description,
        ...addService,
      });
      setIsAddService(true);
      router?.push("/(tabs)/addService/second");
    } else {
      toast.error("Please fill all the input fields");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles?.customHeader}>
        <Text style={styles?.headerText}>Add Service</Text>
      </View>
      <Image source={Step1} style={styles.image} />
      <Stepper currentStep={1} />

      <View style={styles?.formContainer}>
        <TextInputComponent
          label="Work Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter Work Title"
        />
        <TextInputComponent
          label="Work Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter Work Description"
        />

        <Button isPrimary={true} title="Next" onPress={handleNext} />
      </View>
    </ScrollView>
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
    fontWeight: "700",
    fontSize: 20,
  },
  formContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
  },
  label: {
    marginVertical: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: Colors?.primary,
    padding: 8,
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

export default WorkInfo;
