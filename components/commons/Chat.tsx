import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import TextInputComponent from "../inputs/TextInputWithIcon";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";

interface ChatProps {
  chatVisible: boolean;
  setChatVisible: any;
}

const Chat = ({ chatVisible, setChatVisible }: ChatProps) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <Modal
      visible={chatVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setChatVisible(false)}
    >
      <KeyboardAvoidingView behavior="height" style={styles.chatModalContainer}>
        <View style={styles.chatScreen}>
          <View style={styles.chatHeader}>
            <CustomHeading textAlign="left" fontSize={22}>
              Chat with Support
            </CustomHeading>
            <TouchableOpacity onPress={() => setChatVisible(false)}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Chat Messages */}
          <ScrollView style={styles.chatMessagesContainer}>
            {messages.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.messageContainer,
                  message.id === 1
                    ? styles.incomingMessage
                    : styles.outgoingMessage,
                ]}
              >
                <CustomText color={Colors?.white}>{message.text}</CustomText>
              </View>
            ))}
          </ScrollView>

          {/* Chat Input */}
          <View style={styles.chatInputContainer}>
            <TextInputComponent
              style={styles.chatInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              label=""
              name="chat"
              secondIcon={
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={sendMessage}
                >
                  <Feather name="send" size={24} color="#007BFF" />
                </TouchableOpacity>
              }
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  chatModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  chatScreen: {
    backgroundColor: "#fff",
    height: "90%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  chatMessagesContainer: {
    flex: 1,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    maxWidth: "80%",
  },
  incomingMessage: {
    backgroundColor: Colors?.primary,
    alignSelf: "flex-start",
  },
  outgoingMessage: {
    backgroundColor: "#007BFF",
    alignSelf: "flex-end",
  },
  chatInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopColor: "#ddd",
    borderTopWidth: 1,
    paddingTop: 10,
  },
  chatInput: {
    flex: 1,
  },
  sendButton: {
    marginHorizontal: 10,
  },
});

export default Chat;
