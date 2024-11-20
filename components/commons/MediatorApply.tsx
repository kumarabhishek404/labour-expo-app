import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  CheckBox,
  Alert,
} from "react-native";

// Mock User Data
const users = [
  {
    id: 1,
    name: "John Doe",
    profilePic: "https://via.placeholder.com/50",
    skills: ["React Native", "JavaScript", "CSS"],
    address: "123, Main Street, New York",
  },
  {
    id: 2,
    name: "Jane Smith",
    profilePic: "https://via.placeholder.com/50",
    skills: ["Python", "Django", "Data Analysis"],
    address: "456, Elm Street, Chicago",
  },
  // Add more users here
];

// Mock Apply API
const applyApi = async (selectedUsers) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Applied users:", selectedUsers);
      resolve("Success");
    }, 2000);
  });
};

const UserSelectionPopup = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleApply = async () => {
    try {
      const response = await applyApi(selectedUsers);
      if (response === "Success") {
        Alert.alert("Success", "Users applied successfully!");
        setModalVisible(false);
        setSelectedUsers([]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to apply users!");
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <CheckBox
        value={selectedUsers.includes(item.id)}
        onValueChange={() => toggleUserSelection(item.id)}
      />
      <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userSkills}>Skills: {item.skills.join(", ")}</Text>
        <Text style={styles.userAddress}>{item.address}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Open User List</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Users</Text>
            <FlatList
              data={users}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id.toString()}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
              >
                <Text style={styles.buttonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  openButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userSkills: {
    fontSize: 14,
    color: "#555",
  },
  userAddress: {
    fontSize: 12,
    color: "#888",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#FF4C4C",
    padding: 10,
    borderRadius: 5,
    flex: 0.48,
    alignItems: "center",
  },
  applyButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 5,
    flex: 0.48,
    alignItems: "center",
  },
});

export default UserSelectionPopup;
