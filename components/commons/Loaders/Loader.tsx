import Colors from "@/constants/Colors";
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  StatusBar,
} from "react-native";

const Loader = (props: any) => {
  const { loading, ...attributes } = props;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={loading}
      onRequestClose={() => {
        console.log("close modal");
      }}
    >
      <StatusBar backgroundColor={Colors?.background} />
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            size={50}
            color={Colors?.primary}
            animating={loading}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000040",
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: 100,
    width: 100,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default Loader;
