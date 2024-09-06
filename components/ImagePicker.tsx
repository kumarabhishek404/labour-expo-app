import { useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import React from "react";
import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";

export default function ImageUpload() {
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [selectedImages, setSelectedImages]: any = useState([
    // "https://images.unsplash.com/photo-1599719574316-e32146edacb1?q=80&w=2810&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // "https://images.unsplash.com/photo-1623211269755-569fec0536d2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // "https://images.unsplash.com/photo-1575091317298-83c5351a79f2?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ]);

  const pickImageAsync = async () => {
    let result:any = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if(result) {
      let allImages = [...selectedImages, result?.assets[0]?.uri];
      setSelectedImages(allImages);
    }
    if (!result.canceled) {
      //   setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert("You did not select any image.");
    }
  };

  const removeSingleImage = (indexParam: number) => {
    console.log("Indes--", indexParam);

    let allImages = selectedImages?.filter((image: any, index: number) => {
      if (index === indexParam) return;
      else return image;
    });

    setSelectedImages(allImages);
  };

  const onSaveImageAsync = async () => {
    // we will implement this later
  };

  return (
    <View>
      <Text
        style={{
          fontWeight: "bold",
          marginBottom: 4,
        }}
      >
        Upload Work Images
      </Text>
      <View style={styles.container}>
        <View style={styles.imageUploadContainer}>
          <Entypo name="images" size={30} color={Colors.secondary} />
          <TouchableOpacity
            style={styles.imageUploadButton}
            onPress={pickImageAsync}
          >
            <Text style={styles.imageUploadButtonText}>Choose a photo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.selectedImageContainer}>
          {selectedImages && selectedImages?.length > 0 ? (
            selectedImages.map((image: any, index: number) => (
              <View style={styles.imagesContainer}>
                <Entypo
                  name="cross"
                  size={30}
                  color={Colors.secondary}
                  onPress={() => removeSingleImage(index)}
                  style={styles.cancelImage}
                />
                <Image
                  key={index}
                  source={{
                    uri: `${image}`,
                  }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 4,
                    margin: 10,
                  }}
                />
              </View>
            ))
          ) : (
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text>Not uploaded any image</Text>
            </View>
          )}
        </View>
        {selectedImages && selectedImages.length > 0 && (
          <View>
            <TouchableOpacity
              style={styles.imageUploadButton}
              onPress={pickImageAsync}
            >
              <Text style={styles.imageUploadButtonText}>Upload Images</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // height: 153,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 10,
    marginBottom: 20,
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
    borderRadius: 8,
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
});
