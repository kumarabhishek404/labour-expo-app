import React from "react";
import { View, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/Colors";
import { Entypo } from "@expo/vector-icons";
import Button from "./Button";
import CustomText from "../commons/CustomText";
import CustomHeading from "../commons/CustomHeading";

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
      <CustomHeading textAlign="left">Work Images</CustomHeading>
      <View style={[styles.container, errors[name] && styles?.errorInput]}>
        <View style={styles.imageUploadContainer}>
          <Entypo name="images" size={30} color={Colors.secondary} />
          <Button
            isPrimary={true}
            title="Choose images"
            onPress={pickImage}
            style={styles.imageUploadButton}
          />
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
            <CustomText style={{ width: "100%" }}>
              Not added any image
            </CustomText>
          )}
        </View>
      </View>
      {errors[name] && (
        <CustomText textAlign="left" fontSize={10} color={Colors?.danger}>
          {errors[name]?.message || ""}
        </CustomText>
      )}
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
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
    paddingHorizontal: 8,
  },
  cancelImage: {
    position: "absolute",
    zIndex: 1,
    color: Colors.white,
    backgroundColor: Colors.black,
    borderRadius: 50,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: Colors?.danger,
  },
});
