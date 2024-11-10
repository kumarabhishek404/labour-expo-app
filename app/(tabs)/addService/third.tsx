import React from "react";
import { View, StyleSheet, Image } from "react-native";
import Button from "@/components/inputs/Button";
import { Controller, useForm } from "react-hook-form";
import Step4 from "../../../assets/step4.jpg";
import ImageUpload from "@/components/inputs/ImagePicker";
import { toast } from "@/app/hooks/toast";
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
      toast?.error("You can not upload more than 3 images");
    } else {
      setDescription(data?.description);
      if (data?.images && data?.images?.length > 0) setImages(data?.images);
      setStep(4);
    }
  };

  return (
    <View style={styles?.container}>
      <Image source={Step4} style={styles.image} />
      <View style={{ marginVertical: 30 }}>
        <Stepper currentStep={4} steps={ADDSERVICESTEPS} />
      </View>

      <View style={{ flexDirection: "column", gap: 10 }}>
        <Controller
          control={control}
          name="images"
          defaultValue=""
          // rules={{
          //   required: "Please upload at least one image",
          // }}
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
          // rules={{
          //   required: "Work description is required",
          // }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextAreaInputComponent
              label={t("workDescription")}
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
      </View>
      <View style={styles?.buttonContainer}>
        <Button isPrimary={false} title={t("back")} onPress={() => setStep(2)} />
        <Button
          isPrimary={true}
          title={t("saveAndView")}
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
    height: 200,
    resizeMode: "cover",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
});

export default ThirdScreen;
