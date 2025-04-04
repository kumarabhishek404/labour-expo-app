import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/Colors";
import { Entypo } from "@expo/vector-icons";
import Button from "./Button";
import CustomText from "../commons/CustomText";
import CustomHeading from "../commons/CustomHeading";
import { t } from "@/utils/translationHelper";
import ErrorText from "../commons/ErrorText";

interface ImageUploadProps {
  name: string;
  images: any;
  setImages: any;
  onBlur: any;
  errors: any;
}

const ImageUpload = ({
  name,
  images,
  setImages,
  onBlur,
  errors,
}: ImageUploadProps) => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...selectedImages]);
    }
  };

  const removeSingleImage = (indexParam: number) => {
    let allImages = images?.filter((image: any, index: number) => {
      if (index === indexParam) return;
      else return image;
    });
    setImages(allImages);
  };

  return (
    <View>
      <CustomHeading textAlign="left" color={Colors?.inputLabel}>
        {t("workImages")}
      </CustomHeading>
      <View style={[styles.container]}>
        <View style={styles.imageUploadContainer}>
          <Entypo name="images" size={30} color={Colors.secondary} />
          <TouchableOpacity onPress={pickImage}>
            <CustomText
              baseFont={18}
              color={Colors?.tertieryButton}
              fontWeight="600"
            >
              {t("chooseImages")}
            </CustomText>
          </TouchableOpacity>
          {/* <Button
            isPrimary={true}
            title={t('chooseImages')}
            onPress={pickImage}
            bgColor={Colors?.tertieryButton}
            borderColor={Colors?.tertieryButton}
            style={styles.imageUploadButton}
          /> */}
        </View>
        <View style={styles.imageContainer}>
          {images && images?.length > 0 ? (
            images?.map((imgUri: any, index: number) => (
              <View key={index}>
                <Entypo
                  name="cross"
                  size={17}
                  color={Colors.secondary}
                  onPress={() => removeSingleImage(index)}
                  style={styles.cancelImage}
                />
                <Image
                  key={index}
                  source={{ uri: imgUri }}
                  style={styles.uploadedImage}
                />
              </View>
            ))
          ) : (
            <CustomText
              style={{ width: "100%" }}
              color={Colors?.inputPlaceholder}
            >
              {t("notAddedAnyImage")}
            </CustomText>
          )}
        </View>
      </View>
      {errors?.[name] && <ErrorText>{errors?.[name]?.message || ""}</ErrorText>}
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.white,
    borderRadius: 8,
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 10,
    paddingBottom: 20,
    marginTop: 5,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  uploadedImage: {
    width: 70,
    height: 70,
    margin: 10,
    borderRadius: 8,
  },
  imageUploadContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageUploadButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cancelImage: {
    position: "absolute",
    zIndex: 1,
    color: Colors.white,
    backgroundColor: Colors.black,
    borderRadius: 50,
  },
});
