// import React, {useState} from 'react';
// import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';

// const ModalComponent = ({modalVisible, setModalVisible, buttonText}:any) => {
//   return (
//     <View style={styles.centeredView}>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           Alert.alert('Modal has been closed.');
//           setModalVisible(!modalVisible);
//         }}>
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalText}>Hello World!</Text>
//             <Pressable
//               style={[styles.button, styles.buttonClose]}
//               onPress={() => setModalVisible(!modalVisible)}>
//               <Text style={styles.textStyle}>Hide Modal</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//       <Pressable
//         style={[styles.button, styles.buttonOpen]}
//         onPress={() => setModalVisible(true)}>
//         <Text style={styles.textStyle}>{buttonText}</Text>
//       </Pressable>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 22,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   button: {
//     // borderRadius: 20,
//     // padding: 10,
//     // elevation: 2,
//   },
//   buttonOpen: {
//     // backgroundColor: '#F194FF',
//   },
//   buttonClose: {
//     // backgroundColor: '#2196F3',
//   },
//   textStyle: {
//     // color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'right',
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//   },
// });

// export default ModalComponent;

import Colors from "@/constants/Colors";
import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
// import { tailwind } from 'tailwind-rn';
import { useTailwind } from "tailwind-rn";

const ModalComponent = ({ visible, onClose, primaryAction, content }: any) => {
  const tailwind = useTailwind();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles?.container}>
          <View style={styles?.header}>
            <Text style={styles?.headerText}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose} style={styles?.headerButton}>
              <Entypo name="cross" size={30} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          {content()}
          <View style={styles?.buttomWrapper}>
            <TouchableOpacity onPress={onClose} style={styles?.button}>
              <Text style={styles?.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={primaryAction} style={styles?.button}>
              <Text style={styles?.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
  },
  container: {
    backgroundColor: "white",
    width: "100%",
    padding: 10,
    borderRadius: 4,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "700",
    fontSize: 18,
  },
  headerButton: {},
  buttomWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 14,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});

export default ModalComponent;
