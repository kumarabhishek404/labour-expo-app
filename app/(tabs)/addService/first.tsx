import React from "react";
import { StyleSheet, Image, View } from "react-native";
import Colors from "@/constants/Colors";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import Button from "@/components/inputs/Button";
import { Ionicons } from "@expo/vector-icons";
import Stepper from "@/app/(tabs)/addService/stepper";
import { ADDSERVICESTEPS } from "@/constants";
import { Controller, useForm } from "react-hook-form";
import Step1 from "../../../assets/step1.jpg";
import { useSetAtom } from "jotai";
import { AddServiceInProcess } from "@/app/AtomStore/user";
import TextAreaInputComponent from "@/components/inputs/TextArea";

interface FirstScreenProps {
  setStep: any;
  title: string;
  setTitle: any;
  description: string;
  setDescription: any;
}

const FirstScreen: React.FC<FirstScreenProps> = ({
  setStep,
  title,
  setTitle,
  description,
  setDescription,
}: FirstScreenProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: title,
      description: description,
    },
  });
  const setIsAddService = useSetAtom(AddServiceInProcess);

  const onSubmit = (data: any) => {
    setTitle(data?.title);
    setDescription(data?.description);
    setIsAddService(true);
    setStep(2);
  };

  return (
    <>
      <Image source={Step1} style={styles.image} />
      <View style={{ marginVertical: 30 }}>
        <Stepper currentStep={1} steps={ADDSERVICESTEPS} />
      </View>

      <Controller
        control={control}
        name="title"
        defaultValue=""
        rules={{
          required: "Work title is required",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputComponent
            label="Work Title"
            name="title"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Enter your Work Title"
            containerStyle={errors?.title && styles.errorInput}
            errors={errors}
            icon={
              <Ionicons
                name={"mail-outline"}
                size={30}
                color={Colors.secondary}
                style={{ paddingVertical: 10, paddingRight: 10 }}
              />
            }
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        defaultValue=""
        rules={{
          required: "Work description is required",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextAreaInputComponent
            label="Work Description"
            name="description"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Enter your work description"
            containerStyle={errors?.description && styles.errorInput}
            errors={errors}
            icon={
              <Ionicons
                name={"mail-outline"}
                size={30}
                color={Colors.secondary}
                style={{ paddingVertical: 10, paddingRight: 10 }}
              />
            }
          />
        )}
      />
      <Button
        style={styles?.bottomButton}
        isPrimary={true}
        title="Next"
        onPress={handleSubmit(onSubmit)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
  },
  image: {
    width: "100%",
    height: 260,
    resizeMode: "cover",
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
  bottomButton: {
    marginVertical: 20,
  },
});

export default FirstScreen;
