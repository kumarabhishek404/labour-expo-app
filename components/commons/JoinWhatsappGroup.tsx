import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";

interface JoinWhatsAppGroupProps {
  groupLink: string;
  title?: string;
  description?: string;
  buttonText?: string;
}

const JoinWhatsAppGroup: React.FC<JoinWhatsAppGroupProps> = ({
  groupLink,
  title,
  description,
  buttonText,
}) => {
  const handleJoinPress = async () => {
    const supported = await Linking.canOpenURL(groupLink);
    if (supported) {
      Linking.openURL(groupLink);
    } else {
      console.warn("Cannot open WhatsApp link");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <TouchableOpacity style={styles.button} onPress={handleJoinPress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 10,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#2E7D32",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#25D366",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default JoinWhatsAppGroup;
