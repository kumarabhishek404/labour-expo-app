import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { Camera, CameraType, CameraView } from "expo-camera";
import Colors from "@/constants/Colors";
import * as ImageManipulator from "expo-image-manipulator";
import { toast } from "@/app/hooks/toast";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";

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
  const [loading, setLoading] = useState<boolean>(false);
  const cameraRef = useRef<any>(null);
  const [facing, setFacing] = useState<CameraType>("front");

  const pictureOptions = {
    quality: 0.5,
    skipProcessing: true,
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takeSelfie = async () => {
    if (cameraRef.current) {
      try {
        setLoading(true);
        const photo = await cameraRef.current.takePictureAsync();

        const manipulatedPhoto = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ flip: ImageManipulator.FlipType.Horizontal }], // Flip the image horizontally
          { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );

        setLoading(false);
        console.log("manipulatedPhoto--123", manipulatedPhoto);
        setProfilePicture(manipulatedPhoto?.uri);
      } catch (err) {
        console.log("error while capturing image ", err);
        setLoading(false);
        setProfilePicture("");
        toast?.error("Failed to capture image, Retry again!");
      }
    } else {
      setLoading(false);
    }
  };

  const handleRetakeSelfie = () => {
    setProfilePicture("");
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <CustomHeading fontWeight="normal">
          Requesting Camera Permission...
        </CustomHeading>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <CustomHeading>No access to camera</CustomHeading>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {profilePicture ? (
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image source={{ uri: profilePicture }} style={styles.previewImage} />
          <TouchableOpacity
            style={[
              styles.captureButton,
              {
                borderRadius: 100,
                width: 90,
                backgroundColor: Colors?.tertiery,
              },
            ]}
            onPress={handleRetakeSelfie}
          >
            <CustomHeading color={Colors?.white}>RETAKE</CustomHeading>
          </TouchableOpacity>
          <View style={styles.instructionContainer}>
            <CustomText>If you want to click more better selfie?</CustomText>
            {errors[name] && (
              <CustomText textAlign="left" fontSize={10} color={Colors?.danger}>
                {errors[name]?.message || ""}
              </CustomText>
            )}
          </View>
        </View>
      ) : (
        <>
          <View style={styles.cameraContainer}>
            <View
              style={[
                styles.cameraBorderContainer,
                errors[name] && styles?.errorInput,
              ]}
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
              />
              {loading && (
                <ActivityIndicator
                  style={styles.loading}
                  size="large"
                  color="#fff"
                />
              )}
            </View>
          </View>

          {loading ? (
            <View style={styles.captureButton}>
              <ActivityIndicator
                style={styles.circleButton}
                size="large"
                color="#0000ff"
              />
            </View>
          ) : (
            <TouchableOpacity style={styles.captureButton} onPress={takeSelfie}>
              <CustomHeading color={Colors?.white}>PRESS</CustomHeading>
            </TouchableOpacity>
          )}
          <View style={styles.instructionContainer}>
            <CustomText>Position your face in the oval above</CustomText>
            {errors[name] && (
              <CustomText textAlign="left" fontSize={10} color={Colors?.danger}>
                {errors[name]?.message || ""}
              </CustomText>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cameraBorderContainer: {
    width: 250,
    height: 350,
    borderRadius: 200,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loading: {
    position: "absolute",
    backgroundColor: "#000",
    width: 250,
    height: 350,
  },
  camera: {
    width: 250,
    height: 350,
  },
  captureButton: {
    marginTop: 0,
    width: 70,
    height: 70,
    backgroundColor: "#000",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  circleButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: "#fff",
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  flipButton: {
    position: "absolute",
    bottom: 20,
    right: 30,
  },
  previewImage: {
    width: 250,
    height: 350,
    borderRadius: 200,
    resizeMode: "cover",
    marginBottom: 20,
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
  errorInput: {
    borderWidth: 4,
    borderColor: "red",
    width: 250,
    height: 350,
    borderRadius: 200,
  },
  footerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginVertical: 10,
    gap: 5,
  },
});

export default SelfieScreen;
