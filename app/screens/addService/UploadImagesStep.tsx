import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import ImageUpload from "@/components/inputs/ImagePicker";
import ButtonComp from "@/components/inputs/Button";
import Colors from "@/constants/Colors";

interface Props {
  defaultImages: any[];
  onBack: () => void;
  onSubmitFinal: (images: any[]) => void;
}

export default function UploadWorkImagesStep({
  defaultImages,
  onBack,
  onSubmitFinal,
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { images: defaultImages },
  });

  console.log("defaultImages---", defaultImages);

  const submit = (data: any) => {
    if (data.images?.length > 3) {
      TOAST.error(t("maxThreeImages"));
      return;
    }
    console.log("data---", data);
    
    onSubmitFinal(data.images);
  };

  return (
    <View style={{ gap: 25 }}>
      {/* Friendly Heading */}
      <Text style={{ fontSize: 22, fontWeight: "600" }}>
        📸 {t("addWorkPhotos")}
      </Text>

      {/* Guided subtitle */}
      <Text style={{ color: "#666", lineHeight: 22 }}>
        {t("workPhotosGuide")}
      </Text>

      <Controller
        control={control}
        name="images"
        render={({ field: { value, onChange, onBlur } }) => (
          <ImageUpload
            name="images"
            images={value}
            setImages={onChange}
            onBlur={onBlur}
            errors={errors}
          />
        )}
      />

      {/* Tips */}
      <View
        style={{ backgroundColor: "#F5F7FB", padding: 15, borderRadius: 12 }}
      >
        <Text style={{ fontWeight: "600" }}>💡 {t("tips")}</Text>
        <Text style={{ color: "#666", marginTop: 5 }}>
          • {t("tipClearPhoto")}
        </Text>
        <Text style={{ color: "#666" }}>• {t("tipShowWorkPlace")}</Text>
        <Text style={{ color: "#666" }}>• {t("tipOptional")}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.row}>
        <ButtonComp
          isPrimary
          title={t("back")}
          onPress={onBack}
          style={{ width: "30%" }}
          bgColor={Colors?.danger}
          borderColor={Colors?.danger}
        />
        <ButtonComp
          isPrimary
          title={"🚀 " + t("uploadImages")}
          onPress={handleSubmit(submit)}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { color: "#666", lineHeight: 22 },

  tipBox: {
    backgroundColor: "#F5F7FB",
    padding: 15,
    borderRadius: 12,
  },
  tipText: { color: "#666", marginTop: 5, lineHeight: 22 },

  row: { flexDirection: "row", gap: 10, marginTop: 10 },
});
