import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/Colors";
import { Entypo } from "@expo/vector-icons";

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
    console.log("Alll image--", allImages);

    setImages(allImages);
  };

  return (
    <View>
      <View style={[styles.container, errors[name] && styles?.errorInput]}>
        <View style={styles.imageUploadContainer}>
          <Entypo name="images" size={30} color={Colors.secondary} />
          <TouchableOpacity
            onPress={pickImage}
            style={styles.imageUploadButton}
          >
            <Text style={styles.imageUploadButtonText}>Choose images</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          {images && images?.length > 0 ? (
            images?.map((imgUri: any, index: number) => (
              <View key={index} style={styles.imagesContainer}>
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
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text>Not added any image</Text>
            </View>
          )}
        </View>
      </View>
      {errors[name] ? (
        <Text style={styles.errorText}>{errors[name]?.message || ""}</Text>
      ) : (
        <Text></Text>
      )}
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "#f5f7fa",
  //   padding: 20,
  // },
  container: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 4,
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 10,
    marginTop: 20,
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
    borderRadius: 4,
  },
  uploadButton: {
    backgroundColor: Colors?.primary,
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 20,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageUploadContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageUploadButton: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  imageUploadButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
  selectedImageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 18,
  },
  imagesContainer: {},
  cancelImage: {
    position: "absolute",
    zIndex: 1,
    color: Colors.white,
    backgroundColor: Colors.black,
    borderRadius: 50,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
  errorText: {
    flex: 1,
    color: "red",
    fontSize: 12,
    marginRight: 16,
    marginBottom: 10,
  },
});
