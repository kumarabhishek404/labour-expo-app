import React from "react";
import { StyleSheet, Image, StyleProp, ImageStyle } from "react-native";
import profileImage from "../../assets/person-placeholder.jpg";

interface ProfilePictureProps {
  uri: string;
  style?: StyleProp<ImageStyle>;
}

const ProfilePicture = ({ uri, style }: ProfilePictureProps) => {
  return (
    <Image
      source={uri ? { uri: uri } : profileImage}
      style={[styles.productImage, style]}
    />
  );
};

const styles = StyleSheet.create({
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
    elevation: 2
  },
});

export default ProfilePicture;
