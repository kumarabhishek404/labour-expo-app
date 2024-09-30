import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { Feather, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/Colors";
import { router, Stack } from "expo-router";

const FeedbackForm = () => {
  const [rating, setRating] = useState(0); // For star rating
  const [feedbackType, setFeedbackType] = useState(""); // For selected feedback option
  const [comment, setComment] = useState(""); // For text input
  const [images, setImages] = useState<string[]>([]); // For multiple image uploads

  // Handle Image Upload
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Allow multiple images to be picked
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Add new images to the array of images
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...selectedImages]);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Feedback",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 10,
                padding: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 10,
                }}
              >
                <Feather name="arrow-left" size={20} />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>
          How is your first impression of the product?
        </Text>

        {/* Star Rating */}
        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((num) => (
            <TouchableOpacity key={num} onPress={() => setRating(num)}>
              <FontAwesome
                name={num <= rating ? "star" : "star-o"}
                size={40}
                color={num <= rating ? Colors?.primary : "#b3b3b3"}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback Options */}
        <Text style={styles.sectionTitle}>What did you like the most?</Text>
        <RadioButton.Group
          onValueChange={(newValue) => setFeedbackType(newValue)}
          value={feedbackType}
        >
          <RadioButton.Item
            color={Colors?.primary}
            label="Screen capture feedback"
            value="screen_capture"
          />
          <RadioButton.Item
            color={Colors?.primary}
            label="In-app customer surveys"
            value="in_app_surveys"
          />
          <RadioButton.Item
            color={Colors?.primary}
            label="Feedback menu for websites"
            value="feedback_menu"
          />
          <RadioButton.Item
            color={Colors?.primary}
            label="Collaboration dashboard"
            value="collaboration_dashboard"
          />
        </RadioButton.Group>

        {/* Text Input for Additional Comments */}
        <Text style={styles.sectionTitle}>
          What would you like to explore next?
        </Text>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="We'd love to give you the full experience :)"
            value={comment}
            onChangeText={setComment}
            multiline={true}
          />
          {/* Display Uploaded Images Inside the Text Area */}
          <View style={styles.imageContainer}>
            {images.map((imgUri, index) => (
              <Image
                key={index}
                source={{ uri: imgUri }}
                style={styles.uploadedImage}
              />
            ))}
          </View>
        </View>

        {/* Image Upload Button */}
        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
          <Text style={styles.uploadText}>Upload Images</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Send feedback</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default FeedbackForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  textAreaContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  textInput: {
    minHeight: 60,
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  uploadedImage: {
    width: 70,
    height: 70,
    margin: 5,
    borderRadius: 5,
  },
  uploadButton: {
    backgroundColor: Colors?.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: Colors?.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
