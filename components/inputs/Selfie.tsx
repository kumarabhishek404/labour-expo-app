import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  Camera,
  CameraType,
  CameraPictureOptions,
  CameraView,
} from "expo-camera";
import axios from "axios";
import Button from "./Button";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { isLoading } from "expo-font";
import * as ImageManipulator from "expo-image-manipulator";

interface SelfieScreenProps {
  name: string;
  profilePicture: string;
  setProfilePicture: any;
  onBlur: any;
  errors: any;
}

const SelfieScreen = ({
  name,
  profilePicture,
  setProfilePicture,
  onBlur,
  errors,
}: SelfieScreenProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  //   const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  //   const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);
  const [facing, setFacing] = useState<CameraType>("front");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  // CameraPictureOptions object
  const pictureOptions = {
    quality: 0.5, // Image quality (0 to 1)
    skipProcessing: true, // If true, skips image processing
  };

  // Get camera permission on component mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Function to take a selfie
  const takeSelfie = async () => {
    if (cameraRef.current) {
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync();

      const manipulatedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ flip: ImageManipulator.FlipType.Horizontal }], // Flip the image horizontally
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );

      // Set the corrected photo URI
      setLoading(false);
      setProfilePicture(manipulatedPhoto?.uri);
      //   setProfilePicture(
      //     "https://img.freepik.com/premium-photo/happy-indian-farmer-family-smiling-green-field-bright-sunny-day_1076263-3881.jpg"
      //   ); // Store selfie URI in state
      //   validatePhoto(photo.uri);
    } else {
      setLoading(false);
    }
  };

  //   const takeSelfie = async () => {
  //     if (cameraRef) {
  //       const photo = await cameraRef.current.takePictureAsync();

  //       // If using the front camera, flip the image horizontally to correct mirroring
  //       const manipulatedPhoto = await ImageManipulator.manipulateAsync(
  //         photo.uri,
  //         [{ flip: ImageManipulator.FlipType.Horizontal }], // Flip the image horizontally
  //         { compress: 1, format: ImageManipulator.SaveFormat.PNG }
  //       );

  //       // Set the corrected photo URI
  //       setProfilePicture(manipulatedPhoto.uri);
  //     }
  //   };

  const handleCameraFlip = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleRetakeSelfie = () => {
    setProfilePicture("");
  };

  // Validate selfie photo by sending it to the API
  const validatePhoto = async (uri: string) => {
    return true;
    // setLoading(true);
    // try {
    //   const response = await axios.post("https://your-api/validate-selfie", {
    //     imageUri: uri,
    //   });
    //   if (response.data.isValid) {
    //     Alert.alert("Selfie Validated", "Your selfie is valid!");
    //   } else {
    //     Alert.alert("Invalid Selfie", "Please take a realistic human selfie.");
    //     setSelfieUri(null); // Reset the selfie
    //   }
    // } catch (error) {
    //   Alert.alert("Error", "Failed to validate selfie.");
    // } finally {
    //   setLoading(false);
    // }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting Camera Permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {profilePicture ? (
        <View style={{ position: "relative" }}>
          <Image source={{ uri: profilePicture }} style={styles.previewImage} />
          <Button
            isPrimary={true}
            title="Retake"
            style={{
              position: "absolute",
              bottom: 35,
              right: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleRetakeSelfie}
          />
        </View>
      ) : (
        <>
          <View
            style={[styles.cameraContainer, errors[name] && styles?.errorInput]}
          >
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={facing}
              autofocus="off"
              enableTorch={true}
              flash="on"
              mirror={false}
              mode="picture"
              ratio="16:9"
            >
              {/* Oval Masking Layer */}
              <View style={styles.maskContainer}>
                {/* <View style={styles.maskTop} /> */}
                <View style={styles.maskLeftRightContainer}>
                  {/* <View style={styles.maskSide} /> */}
                  <View style={styles.ovalFrame} />
                  {/* <View style={styles.maskSide} /> */}
                </View>
                {/* <View style={styles.maskBottom} /> */}
              </View>
            </CameraView>

            {loading ? (
              <View style={styles.captureButton}>
                <ActivityIndicator
                  style={styles?.circleButton}
                  size="large"
                  color="#0000ff"
                />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takeSelfie}
              >
                <View style={styles.circleButton}>
                  <Text style={styles?.circleButtonText}>PRESS</Text>
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.flipButton}
              onPress={handleCameraFlip}
            >
              <MaterialCommunityIcons
                name="camera-flip"
                size={35}
                color={Colors.white}
              />
              <Text style={styles?.circleButtonText}>FLIP</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.instructionContainer}>
            <Text style={styles.instructions}>Verify your identity</Text>
            <Text style={styles.positionText}>
              Position your face in the camera view above
            </Text>
            {errors[name] && (
              <Text style={styles.errorText}>
                {errors[name]?.message || ""}
              </Text>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    height: 400,
  },
  camera: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  maskContainer: {
    ...StyleSheet.absoluteFillObject, // Overlay fills entire screen
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  maskTop: {
    width: "100%",
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark area above the oval
  },
  maskBottom: {
    width: "100%",
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark area below the oval
  },
  maskLeftRightContainer: {
    flexDirection: "row",
  },
  maskSide: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark areas on the sides
  },
  ovalFrame: {
    width: 250,
    height: 400,
    borderColor: "white",
    borderWidth: 2,
    // borderRadius: 157, // Oval shape
    overflow: "hidden", // Clip the camera preview
  },
  instructionContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  instructions: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  positionText: {
    color: "#000",
    fontSize: 14,
    textAlign: "center",
  },
  captureButton: {
    position: "absolute",
    bottom: 20,
    left: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  circleButton: {
    width: 70,
    height: 70,
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    borderRadius: 35,
    borderWidth: 5,
    borderColor: "#fff",
    backgroundColor: "#000",
  },
  circleButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  flipButton: {
    position: "absolute",
    bottom: 20,
    right: 30,
    width: 50,
    height: 70,
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    borderRadius: 8,
    // borderWidth: 5,
    borderColor: "#fff",
    backgroundColor: "#000",
  },
  previewImage: {
    width: 250,
    borderRadius: 8,
    height: 400,
    resizeMode: "cover",
    marginBottom: 20,
  },
  retakeButton: {},
  errorInput: {
    borderWidth: 4,
    borderColor: "red",
    color: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default SelfieScreen;
