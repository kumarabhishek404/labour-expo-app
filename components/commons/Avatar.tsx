import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import CustomText from "./CustomText";
import placeholderProfileImage from "../../assets/person-placeholder.jpg";
import { t } from "@/utils/translationHelper";
import Colors from "@/constants/Colors";
import ProfilePicture from "./ProfilePicture";

type AvatarProps = {
  isEditable: boolean;
  isLoading?: boolean;
  profileImage: string;
  onUpload?: any;
  style?: any;
  avatarWrapperStyle?: any;
};

const AvatarComponent = ({
  isEditable,
  isLoading,
  profileImage,
  onUpload,
  style,
  avatarWrapperStyle
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
      <View style={[styles.avatarWrapper, avatarWrapperStyle]}>
        <ProfilePicture uri={profileImage} style={styles.profilePicture} />

        {isLoading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={Colors?.white} />
          </View>
        )}
      </View>
      {isEditable && (
        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
          <CustomText>{t("uploadNewImage")}</CustomText>
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
