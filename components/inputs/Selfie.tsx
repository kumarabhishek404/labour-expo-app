import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { Camera, CameraType, CameraView } from "expo-camera";
import Colors from "@/constants/Colors";
import * as ImageManipulator from "expo-image-manipulator";
import { toast } from "@/app/hooks/toast";

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
            <Text
              style={{
                color: Colors?.white,
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              RETAKE
            </Text>
          </TouchableOpacity>
          <View style={styles.instructionContainer}>
            <Text style={styles.positionText}>
              If you want to click more better selfie?
            </Text>
            {errors[name] && (
              <Text style={styles.errorText}>
                {errors[name]?.message || ""}
              </Text>
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
              <Text
                style={{
                  color: Colors?.white,
                  fontWeight: "700",
                  fontSize: 16,
                }}
              >
                PRESS
              </Text>
            </TouchableOpacity>
          )}
          <View style={styles.instructionContainer}>
            <Text style={styles.positionText}>
              Position your face in the oval above
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
    // flex: 1,
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
    // borderWidth: 3,
    // borderColor: "#000",
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
  positionText: {
    color: "#000",
    fontSize: 14,
    textAlign: "center",
  },
  errorInput: {
    borderWidth: 4,
    borderColor: "red",
    width: 250,
    height: 350,
    borderRadius: 200,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  footerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginVertical: 10,
    gap: 5,
  },
  accountText: {
    fontSize: 12,
    color: Colors.primary,
  },
  signupText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});

export default SelfieScreen;

// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   ActivityIndicator,
// } from "react-native";
// import {
//   Camera,
//   CameraDevice,
//   useCameraDevices,
// } from "react-native-vision-camera";
// import { useFrameProcessor } from "react-native-vision-camera";
// import { scanFaces } from "vision-camera-face-detector"; // Correct import for face detection (may need to check the actual function name)
// import { runOnJS } from "react-native-reanimated";
// import Colors from "@/constants/Colors";
// import { toast } from "@/app/hooks/toast";

// interface SelfieScreenProps {
//   name: string;
//   profilePicture: string;
//   setProfilePicture: any;
//   onBlur: any;
//   errors: any;
// }

// const SelfieScreen = ({
//   name,
//   profilePicture,
//   setProfilePicture,
//   onBlur,
//   errors,
// }: SelfieScreenProps) => {
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [isFaceDetected, setIsFaceDetected] = useState(false); // Track if a face is detected
//   const cameraRef = useRef<any>(null);
//   const devices = useCameraDevices();
//   // const device = devices.front;
//   const device = devices?.find(
//     (device: CameraDevice) => device.position === "front"
//   );

//   useEffect(() => {
//     (async () => {
//       const status = await Camera.requestCameraPermission();
//       setHasPermission(status === "granted");
//     })();
//   }, []);

//   const takeSelfie = async () => {
//     if (cameraRef.current && isFaceDetected) {
//       try {
//         setLoading(true);
//         const photo = await cameraRef.current.takePhoto({
//           quality: 0.5,
//           skipProcessing: true,
//         });

//         setLoading(false);
//         setProfilePicture(photo.uri);
//       } catch (err) {
//         console.log("Error while capturing image ", err);
//         setLoading(false);
//         setProfilePicture("");
//         toast?.error("Failed to capture image, retry again!");
//       }
//     } else {
//       toast?.error("No face detected!");
//     }
//   };

//   const handleRetakeSelfie = () => {
//     setProfilePicture("");
//   };

//   // Frame processor to detect faces in real-time
//   const frameProcessor = useFrameProcessor((frame) => {
//     "worklet";
//     const faces = scanFaces(frame); // Corrected face detection function (use scanFaces)
//     if (faces.length > 0) {
//       const face = faces[0];
//       const faceInsideOval = isFaceInsideOval(face.bounds);
//       runOnJS(setIsFaceDetected)(faceInsideOval); // Only set if the face is inside the oval
//     } else {
//       runOnJS(setIsFaceDetected)(false);
//     }
//   }, []);
//   // const frameProcessor = useFrameProcessor((frame) => {
//   //   "worklet";
//   //   const now = Date.now();

//   //   // Limit frame processing to 1 FPS (1000ms delay)
//   //   if (now - lastFrameTimeRef.current >= 1000) {
//   //     const faces = scanFaces(frame);
//   //     if (faces.length > 0) {
//   //       const face = faces[0];
//   //       const faceInsideOval = isFaceInsideOval(face.bounds);
//   //       runOnJS(setIsFaceDetected)(faceInsideOval); // Update face detection state
//   //     } else {
//   //       runOnJS(setIsFaceDetected)(false);
//   //     }
//   //     lastFrameTimeRef.current = now;
//   //   }
//   // }, []);

//   // Helper function to check if the face is inside the oval area
//   const isFaceInsideOval = (bounds: {
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//   }) => {
//     const faceCenterX = bounds.x + bounds.width / 2;
//     const faceCenterY = bounds.y + bounds.height / 2;

//     // Oval parameters
//     const ovalCenterX = 125;
//     const ovalCenterY = 175;
//     const ovalRadiusX = 125;
//     const ovalRadiusY = 175;

//     const insideOval =
//       Math.pow((faceCenterX - ovalCenterX) / ovalRadiusX, 2) +
//         Math.pow((faceCenterY - ovalCenterY) / ovalRadiusY, 2) <=
//       1;

//     return insideOval;
//   };

//   if (hasPermission === null) {
//     return (
//       <View style={styles.container}>
//         <Text>Requesting Camera Permission...</Text>
//       </View>
//     );
//   }

//   if (hasPermission === false) {
//     return (
//       <View style={styles.container}>
//         <Text>No access to camera</Text>
//       </View>
//     );
//   }

//   // const lastFrameTimeRef = useRef<number>(0);

//   return (
//     <View style={styles.container}>
//       {profilePicture ? (
//         <View
//           style={{
//             width: "100%",
//             justifyContent: "center",
//             alignItems: "center",
//             gap: 10,
//           }}
//         >
//           <Image source={{ uri: profilePicture }} style={styles.previewImage} />
//           <View style={styles.footerContainer}>
//             <Text style={styles.accountText}>
//               Want to click more better selfie?
//             </Text>
//             <TouchableOpacity onPress={handleRetakeSelfie}>
//               <Text style={styles.signupText}>Retake Selfie</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       ) : (
//         <>
//           <View
//             style={[styles.cameraContainer, errors[name] && styles.errorInput]}
//           >
//             <View style={styles.cameraBorderContainer}>
//               {device && (
//                 <Camera
//                   ref={cameraRef}
//                   style={styles.camera}
//                   device={device}
//                   isActive={true}
//                   frameProcessor={frameProcessor}
//                   // frameProcessorFps={1}
//                   photo={true}
//                 />
//               )}
//               {loading && (
//                 <ActivityIndicator
//                   style={styles.loading}
//                   size="large"
//                   color="#fff"
//                 />
//               )}
//             </View>
//           </View>

//           {loading ? (
//             <View style={styles.captureButton}>
//               <ActivityIndicator
//                 style={styles.circleButton}
//                 size="large"
//                 color="#0000ff"
//               />
//             </View>
//           ) : (
//             <TouchableOpacity
//               style={[
//                 styles.captureButton,
//                 !isFaceDetected && { backgroundColor: "#d3d3d3" }, // Disable button when no face detected
//               ]}
//               onPress={takeSelfie}
//               disabled={!isFaceDetected} // Disable button when no face detected
//             >
//               <Text
//                 style={{
//                   color: Colors?.white,
//                   fontWeight: "700",
//                   fontSize: 16,
//                 }}
//               >
//                 PRESS
//               </Text>
//             </TouchableOpacity>
//           )}
//           <View style={styles.instructionContainer}>
//             <Text style={styles.positionText}>
//               Position your face in the oval above
//             </Text>
//             {errors[name] && (
//               <Text style={styles.errorText}>
//                 {errors[name]?.message || ""}
//               </Text>
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cameraContainer: {
//     width: 300,
//     height: 350,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cameraBorderContainer: {
//     width: 250,
//     height: 350,
//     borderRadius: 200,
//     overflow: "hidden",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   loading: {
//     position: "absolute",
//     backgroundColor: "#000",
//     width: 250,
//     height: 350,
//   },
//   camera: {
//     width: 250,
//     height: 350,
//   },
//   captureButton: {
//     marginTop: 0,
//     width: 70,
//     height: 70,
//     backgroundColor: "#000",
//     borderRadius: 40,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   circleButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     borderWidth: 5,
//     borderColor: "#fff",
//     backgroundColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   previewImage: {
//     width: "100%",
//     height: 350,
//     borderRadius: 8,
//     resizeMode: "cover",
//   },
//   instructionContainer: {
//     marginVertical: 20,
//     alignItems: "center",
//   },
//   positionText: {
//     color: "#000",
//     fontSize: 14,
//     textAlign: "center",
//   },
//   errorInput: {
//     borderWidth: 4,
//     padding: 4,
//     borderColor: "red",
//     borderRadius: 90,
//   },
//   errorText: {
//     color: "red",
//     fontSize: 12,
//     marginBottom: 10,
//   },
//   footerContainer: {
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     alignItems: "flex-end",
//     marginVertical: 10,
//     gap: 5,
//   },
//   accountText: {
//     color: Colors.primary,
//   },
//   signupText: {
//     color: Colors.black,
//     fontSize: 20,
//     fontWeight: "500",
//     textDecorationLine: "underline",
//   },
// });

// export default SelfieScreen;
