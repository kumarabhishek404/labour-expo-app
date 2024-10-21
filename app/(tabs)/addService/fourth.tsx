import React from "react";
import { View, StyleSheet, Image } from "react-native";
import Button from "@/components/inputs/Button";
import Stepper from "@/app/(tabs)/addService/stepper";
import { ADDSERVICESTEPS, REGISTERSTEPS } from "@/constants";
import { Controller, useForm } from "react-hook-form";
import Step4 from "../../../assets/step4.jpg";
import ImageUpload from "@/components/inputs/ImagePicker";
import { AddServiceAtom } from "@/app/AtomStore/user";
import { useAtom, useAtomValue } from "jotai";

interface FourthScreenProps {
  setStep: any;
  images: string;
  setImages: any;
}

const FourthScreen: React.FC<FourthScreenProps> = ({
  setStep,
  images,
  setImages,
}: FourthScreenProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      images: images,
    },
  });
  const onSubmit = (data: any) => {
    setImages(data?.images);
    setStep(5);
  };

  return (
    <View style={styles?.container}>
      <Image source={Step4} style={styles.image} />
      <View style={{ marginVertical: 30 }}>
        <Stepper currentStep={4} steps={ADDSERVICESTEPS} />
      </View>

      <View style={{ flexDirection: "column", gap: 15 }}>
        <Controller
          control={control}
          name="images"
          defaultValue=""
          rules={{
            required: "Please upload at least one image",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ImageUpload
              name="images"
              images={value}
              setImages={onChange}
              onBlur={onBlur}
              errors={errors}
            />
          )}
        />
      </View>
      <View style={styles?.buttonContainer}>
        <Button isPrimary={false} title="Back" onPress={() => setStep(3)} />
        <Button
          isPrimary={true}
          title="Save and View"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
});

export default FourthScreen;
