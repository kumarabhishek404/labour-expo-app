import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/Colors";
import { Entypo } from "@expo/vector-icons";

const ImageUpload = ({ images, setImages }: any) => {
  // const [images, setImages] = useState<string[]>([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...selectedImages]);
    }
  };

  const removeSingleImage = (indexParam: number) => {
    let allImages = images?.filter((image: any, index: number) => {
      if (index === indexParam) return;
      else return image;
    });
    setImages(allImages);
  };

  return (
    <View>
      {/* <View style={styles.imageContainer}>
        {images.map((imgUri, index) => (
          <Image
            key={index}
            source={{ uri: imgUri }}
            style={styles.uploadedImage}
          />
        ))}
      </View> */}

      {/* <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
        <Text style={styles.uploadText}>Upload Images</Text>
      </TouchableOpacity> */}

      <View style={styles.container}>
        <View style={styles.imageUploadContainer}>
          <Entypo name="images" size={30} color={Colors.secondary} />
          {/* <TouchableOpacity
            style={styles.imageUploadButton}
            // onPress={pickImageAsync}
          >
            <Text style={styles.imageUploadButtonText}>Choose a photo</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={pickImage}
            style={styles.imageUploadButton}
          >
            {/* <Text style={styles.uploadText}>Upload Images</Text> */}
            <Text style={styles.imageUploadButtonText}>Choose images</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          {images && images?.length > 0 ? (
            images.map((imgUri: any, index: number) => (
              <View key={index} style={styles.imagesContainer}>
                <Entypo
                  name="cross"
                  size={17}
                  color={Colors.secondary}
                  onPress={() => removeSingleImage(index)}
                  style={styles.cancelImage}
                />
                <Image
                  key={index}
                  source={{ uri: imgUri }}
                  style={styles.uploadedImage}
                />
              </View>
            ))
          ) : (
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text>Not added any image</Text>
            </View>
          )}
        </View>
        {/* <View style={styles.selectedImageContainer}>
          {images && images?.length > 0 ? (
            images.map((image: any, index: number) => (
              <View key={index} style={styles.imagesContainer}>
                <Entypo
                  name="cross"
                  size={30}
                  color={Colors.secondary}
                  onPress={() => removeSingleImage(index)}
                  style={styles.cancelImage}
                />
                <Image
                  key={index}
                  source={{
                    uri: `${image}`,
                  }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 4,
                    margin: 10,
                  }}
                />
              </View>
            ))
          ) : (
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text>Not uploaded any image</Text>
            </View>
          )}
        </View> */}
        {/* {images && images.length > 0 && (
          <View>
            <TouchableOpacity
              style={styles.imageUploadButton}
              // onPress={pickImageAsync}
            >
              <Text style={styles.imageUploadButtonText}>Upload Images</Text>
            </TouchableOpacity>
          </View>
        )} */}
      </View>
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "#f5f7fa",
  //   padding: 20,
  // },
  container: {
    // height: 153,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 10,
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  uploadedImage: {
    width: 70,
    height: 70,
    margin: 10,
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
  imageUploadContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageUploadButton: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  imageUploadButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
  selectedImageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 18,
  },
  imagesContainer: {},
  cancelImage: {
    position: "absolute",
    zIndex: 1,
    color: Colors.white,
    backgroundColor: Colors.black,
    borderRadius: 50,
  },
});

// import { useState } from "react";
// import {
//   Button,
//   Image,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";

// import React from "react";
// import {
//   Entypo,
//   MaterialCommunityIcons,
//   MaterialIcons,
// } from "@expo/vector-icons";
// import Colors from "@/constants/Colors";

// export default function ImageUpload({images, setImages}:any) {
//   const [showAppOptions, setShowAppOptions] = useState(false);
//   // const [images, setImages]: any = useState([
//   //   // "https://images.unsplash.com/photo-1599719574316-e32146edacb1?q=80&w=2810&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   //   // "https://images.unsplash.com/photo-1623211269755-569fec0536d2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   //   // "https://images.unsplash.com/photo-1575091317298-83c5351a79f2?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   // ]);

//   const pickImageAsync = async () => {
//     // let result:any = await ImagePicker.launchImageLibraryAsync({
//     //   allowsEditing: true,
//     //   quality: 1,
//     // });

//     // console.log("result00000", result);

//     // if(result) {
//     //   let allImages = [...images, result?.assets[0]?.uri];
//     //   setImages(allImages);
//     // }
//     // if (!result.canceled) {
//     //   setImages(result.assets[0].uri);
//     //   setShowAppOptions(true);
//     // } else {
//     //   alert("You did not select any image.");
//     // }

//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         quality: 1,
//       });

//       if (!result.canceled) {
//         setImages(result.assets[0].uri);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const removeSingleImage = (indexParam: number) => {
//     console.log("Indes--", indexParam);

//     let allImages = images?.filter((image: any, index: number) => {
//       if (index === indexParam) return;
//       else return image;
//     });

//     setImages(allImages);
//   };

//   const onSaveImageAsync = async () => {
//     // we will implement this later
//   };

//   return (
//     <View>
//       <Text
//         style={{
//           fontWeight: "bold",
//           marginBottom: 4,
//         }}
//       >
//         Upload Work Images
//       </Text>
// <View style={styles.container}>
//   <View style={styles.imageUploadContainer}>
//     <Entypo name="images" size={30} color={Colors.secondary} />
//     <TouchableOpacity
//       style={styles.imageUploadButton}
//       onPress={pickImageAsync}
//     >
//       <Text style={styles.imageUploadButtonText}>Choose a photo</Text>
//     </TouchableOpacity>
//   </View>
//   {/* <View style={styles.selectedImageContainer}>
//     {images && images?.length > 0 ? (
//       images.map((image: any, index: number) => (
//         <View key={index} style={styles.imagesContainer}>
//           <Entypo
//             name="cross"
//             size={30}
//             color={Colors.secondary}
//             onPress={() => removeSingleImage(index)}
//             style={styles.cancelImage}
//           />
//           <Image
//             key={index}
//             source={{
//               uri: `${image}`,
//             }}
//             style={{
//               width: 100,
//               height: 100,
//               borderRadius: 4,
//               margin: 10,
//             }}
//           />
//         </View>
//       ))
//     ) : (
//       <View style={{ flex: 1, alignItems: "center" }}>
//         <Text>Not uploaded any image</Text>
//       </View>
//     )}
//   </View> */}
//   {images && images.length > 0 && (
//     <View>
//       <TouchableOpacity
//         style={styles.imageUploadButton}
//         onPress={pickImageAsync}
//       >
//         <Text style={styles.imageUploadButtonText}>Upload Images</Text>
//       </TouchableOpacity>
//     </View>
//   )}
// </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     // height: 153,
//     borderWidth: 1,
//     borderColor: Colors.secondary,
//     borderRadius: 8,
//     flexDirection: "column",
//     alignItems: "flex-start",
//     padding: 10,
//     marginBottom: 20,
//   },
//   imageUploadContainer: {
//     width: "100%",
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   imageUploadButton: {
//     backgroundColor: Colors.primary,
//     padding: 8,
//     borderRadius: 8,
//   },
//   imageUploadButtonText: {
//     color: Colors.white,
//     fontSize: 16,
//   },
//   selectedImageContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginVertical: 18,
//   },
//   imagesContainer: {},
//   cancelImage: {
//     position: "absolute",
//     zIndex: 1,
//     color: Colors.white,
//     backgroundColor: Colors.black,
//     borderRadius: 50,
//   },
// });
