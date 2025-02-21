import React from "react";
import { View, StyleSheet, Image } from "react-native";
import Button from "@/components/inputs/Button";
import { Controller, useForm } from "react-hook-form";
import Step4 from "../../../assets/step4.jpg";
import ImageUpload from "@/components/inputs/ImagePicker";
import TOAST from "@/app/hooks/toast";
import TextAreaInputComponent from "@/components/inputs/TextArea";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Stepper from "@/components/commons/Stepper";
import { ADDSERVICESTEPS } from "@/constants";
import { t } from "@/utils/translationHelper";

interface ThirdScreenProps {
  setStep: any;
  images: string;
  setImages: any;
  description: string;
  setDescription: any;
}

const ThirdScreen: React.FC<ThirdScreenProps> = ({
  setStep,
  images,
  setImages,
  description,
  setDescription,
}: ThirdScreenProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      images: images,
      description: description,
    },
  });
  const onSubmit = (data: any) => {
    console.log("data?.images?.length--", data?.images?.length);

    if (data?.images && data?.images?.length > 3) {
      TOAST?.error("You can not upload more than 3 images");
    } else {
      setDescription(data?.description);
      if (data?.images && data?.images?.length > 0) setImages(data?.images);
      setStep(4);
    }
  };

  return (
    <View style={styles?.container}>
      <View style={{ flexDirection: "column", gap: 25 }}>
        <Controller
          control={control}
          name="images"
          defaultValue=""
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

        <Controller
          control={control}
          name="description"
          defaultValue=""
          render={({ field: { onChange, onBlur, value } }) => (
            <TextAreaInputComponent
              label="workDescription"
              name="description"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Enter work description"
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
      </View>
      <View style={styles?.buttonContainer}>
        <Button
          isPrimary={true}
          title={t("back")}
          onPress={() => setStep(2)}
          bgColor={Colors?.danger}
          borderColor={Colors?.danger}
          style={{ width: "30%" }}
        />
        <Button
          isPrimary={true}
          title={t("saveAndNext")}
          onPress={handleSubmit(onSubmit)}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "transparent",
  },
  image: {
    width: "80%",
    height: 210,
    resizeMode: "cover",
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
});

export default ThirdScreen;
