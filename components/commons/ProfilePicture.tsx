import React from "react";
import { StyleSheet, Image } from "react-native";
import profileImage from "../../assets/person-placeholder.jpg";

interface ProfilePictureProps {
  uri: string;
}

const ProfilePicture = ({ uri }: ProfilePictureProps) => {
  return (
    <Image
      source={uri ? { uri: uri } : profileImage}
      style={styles.productImage}
    />
  );
};

const styles = StyleSheet.create({
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
});

export default ProfilePicture;
