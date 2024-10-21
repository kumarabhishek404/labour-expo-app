import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

type AvatarProps = {
  isEditable: Boolean;
  isLoading?: boolean;
  profileImage: String;
  onUpload?: any;
  style?: any
};

const AvatarComponent = ({
  isEditable,
  isLoading,
  profileImage,
  onUpload,
  style
}: AvatarProps) => {
  const pickImage = async () => {
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      try {
        let response = await onUpload(result?.assets[0]?.uri);
        console.log(" Resppsne ---", response);
      } catch (err) {
        console.log("Error --", err);
      }
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.avatarWrapper}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("../../assets/person-placeholder.jpg") // Placeholder image when no profile picture
          }
          style={styles.profilePicture}
        />

        {isLoading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}
      </View>
      {isEditable && (
        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
          <Text style={styles.iconText}>Upload New Image</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrapper: {
    position: "relative",
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 2,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderColor: "#ddd",
  },
  loader: {
    position: "absolute",
    top: 48,
    left: 48,
    zIndex: 2,
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  editIcon: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 6,
  },
  iconText: {
    fontSize: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AvatarComponent;
