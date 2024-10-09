import React, { SetStateAction, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

type AvatarProps = {
  isEditable: Boolean;
  profileImage: String;
  setProfileImage?: any;
  onUpload?: any;
};

const AvatarComponent = ({
  isEditable,
  profileImage,
  setProfileImage,
  onUpload,
}: AvatarProps) => {
  const pickImage = async () => {
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
    }

    try {
      let response = await onUpload();
      console.log(" Resppsne ---", response);
    } catch (err) {
      console.log("Error --", err);
    }
  };

  const removeImage = () => {
    Alert.alert(
      "Remove Image",
      "Are you sure you want to remove the profile image?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", onPress: () => setProfileImage(null) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("../assets/person-placeholder.png") // Placeholder image when no profile picture
          }
          style={styles.avatar}
        />
      </View>
      {isEditable && (
        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
          <Text style={styles.iconText}>Upload New Image</Text>
        </TouchableOpacity>
      )}
      {profileImage && isEditable && (
        <TouchableOpacity style={styles.editIcon} onPress={removeImage}>
          <Text style={styles.iconText}>Remove Image</Text>
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
    borderColor: "#ddd",
  },
  avatar: {
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
});

export default AvatarComponent;
