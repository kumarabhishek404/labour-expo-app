import React from "react";
import { StyleSheet, Image, StyleProp, ImageStyle } from "react-native";
import profileImage from "../../assets/person-placeholder.jpg";

interface ProfilePictureProps {
  uri: string;
  source?: any;
  style?: StyleProp<ImageStyle>;
}

const ProfilePicture = ({ uri, source, style }: ProfilePictureProps) => {
  return (
    <Image
      source={uri ? { uri: uri } : source || profileImage}
      style={[styles.productImage, style]}
    />
  );
};

const styles = StyleSheet.create({
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 100
  },
});

export default ProfilePicture;
