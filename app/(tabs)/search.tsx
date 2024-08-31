// // import { StyleSheet, Text, View } from 'react-native'
// // import React from 'react'

// // const Page = () => {
// //   return (
// //     <View style={styles.container}>
// //       <Text>Search</Text>
// //     </View>
// //   )
// // }

// // export default Page

// // const styles = StyleSheet.create({
// //   container: {
// //     flex:1,
// //     justifyContent:'center',
// //     alignItems:'center',
// //   }
// // })

// // import { StyleSheet, Text, View } from 'react-native'
// // import React from 'react'

// // const Page = () => {
// //   return (
// //     <View style={styles.container}>
// //       <Text>Search</Text>
// //     </View>
// //   )
// // }

// // export default Page

// // const styles = StyleSheet.create({
// //   container: {
// //     flex:1,
// //     justifyContent:'center',
// //     alignItems:'center',
// //   }
// // })

// // import Header from '@/components/common/Header';
// import Field from "@/components/Field";
// import Header from "@/components/Header";
// import Colors from "@/constants/Colors";
// import { Ionicons } from "@expo/vector-icons";
// import { Stack } from "expo-router";
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   ScrollView,
// } from "react-native";

// const AddService = () => {
//   const [workName, setWorkName] = useState("");
//   const [workDescription, setWorkDescription] = useState("");
//   const [time, setTime] = useState("");
//   const [location, setLocation] = useState("");
//   const [amount, setAmount] = useState("");
//   const [selectedImage, setSelectedImage] = useState(null);

//   const handleImageUpload = () => {
//     // Implement image upload logic here
//     // This could involve using a library like react-native-image-picker
//     // For simplicity, we'll just set a placeholder image in this example
//     setSelectedImage(require("../../assets/images/cover.jpg"));
//   };

//   const handleSave = () => {
//     // Implement save logic here
//     console.log("Save button pressed");
//   };

//   const handlePost = () => {
//     // Implement post logic here
//     console.log("Post button pressed");
//   };

//   return (
//     // eslint-disable-next-line react-native/no-inline-styles
//     <>
//       <Stack.Screen
//         options={{
//           headerLeft: () => (
//             <TouchableOpacity onPress={() => {}} style={{ marginLeft: 20 }}>
//               <Image
//                 source={{
//                   uri: "https://xsgames.co/randomusers/avatar.php?g=female",
//                 }}
//                 style={{ width: 40, height: 40, borderRadius: 10 }}
//               />
//             </TouchableOpacity>
//           ),
//           headerRight: () => (
//             <TouchableOpacity
//               onPress={() => {}}
//               style={{
//                 marginRight: 20,
//                 backgroundColor: Colors.white,
//                 padding: 10,
//                 borderRadius: 10,
//                 shadowColor: "#171717",
//                 shadowOffset: { width: 2, height: 4 },
//                 shadowOpacity: 0.2,
//                 shadowRadius: 3,
//               }}
//             >
//               <Ionicons name="notifications" size={20} color={Colors.black} />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//       <View style={{ flex: 1 }}>
//         {/* <Header navigation={navigation} /> */}
//         <ScrollView>
//           <View style={styles.container}>
//             {/* <Text style={styles.heading}>Add Service</Text> */}
//             <Field style={styles.input} placeholder="Work Name" />

//             <TextInput
//               style={styles.input}
//               placeholder="Work Name"
//               value={workName}
//               onChangeText={(text) => setWorkName(text)}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Work Description"
//               value={workDescription}
//               onChangeText={(text) => setWorkDescription(text)}
//               multiline
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Time"
//               value={time}
//               onChangeText={(text) => setTime(text)}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Location"
//               value={location}
//               onChangeText={(text) => setLocation(text)}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Amount"
//               value={amount}
//               onChangeText={(text) => setAmount(text)}
//               keyboardType="numeric"
//             />

//             {/* Image Upload */}
//             <TouchableOpacity
//               style={styles.imageUploadButton}
//               onPress={handleImageUpload}
//             >
//               <Text style={styles.uploadButtonText}>Upload Image</Text>
//             </TouchableOpacity>
//             {selectedImage && (
//               <Image source={selectedImage} style={styles.selectedImage} />
//             )}

//             {/* Save and Post Buttons */}
//             <View style={styles.buttonContainer}>
//               <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//                 <Text style={styles.buttonText}>Save</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.postButton} onPress={handlePost}>
//                 <Text style={styles.buttonText}>Post</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#FF9933",
//     marginBottom: 16,
//   },
//   input: {
//     height: 40,
//     borderColor: "#FF9933",
//     borderWidth: 1,
//     marginBottom: 16,
//     paddingLeft: 8,
//   },
//   imageUploadButton: {
//     backgroundColor: "#FF9933",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   uploadButtonText: {
//     color: "white",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   selectedImage: {
//     width: "100%",
//     height: 200,
//     resizeMode: "cover",
//     marginBottom: 16,
//     borderRadius: 8,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   saveButton: {
//     flex: 1,
//     backgroundColor: "#FF9933",
//     padding: 16,
//     borderRadius: 8,
//     marginRight: 8,
//   },
//   postButton: {
//     flex: 1,
//     backgroundColor: "#FF9933",
//     padding: 16,
//     borderRadius: 8,
//     marginLeft: 8,
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
// });

// export default AddService;

// // import Header from '@/components/common/Header';
// import { Link } from 'expo-router';
// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
// // import {Picker} from '@react-native-picker/picker';
// // import DropDownPicker from 'react-native-dropdown-picker';

// const RegisterScreen = ({navigation}: any) => {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [mobile, setMobile] = useState('');
//   const [role, setRole] = useState('');
//   const [password, setPassword] = useState('');
//   const [address, setAddress] = useState('');
//   const [state, setState] = useState('');
//   const [country, setCountry] = useState('');
//   const [pincode, setPincode] = useState('');
//   const [selectedValue, setSelectedValue] = useState(null);

//   const items = [
//     {label: 'Option 1', value: 'option1'},
//     {label: 'Option 2', value: 'option2'},
//     {label: 'Option 3', value: 'option3'},
//   ];

//   const validateEmail = (email: any) => {
//     // Basic email validation
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   };

//   const validateMobile = (mobile: any) => {
//     // Basic mobile number validation
//     return /^[0-9]{10}$/.test(mobile);
//   };

//   const validatePassword = (password: any) => {
//     // Password should be at least 6 characters
//     return password.length >= 6;
//   };

//   const handleRegister = () => {
//     // Perform validation before registration
//     if (
//       !firstName ||
//       !lastName ||
//       !validateEmail(email) ||
//       !validateMobile(mobile) ||
//       !validatePassword(password) ||
//       !address ||
//       !state ||
//       !country ||
//       !pincode
//     ) {
//       alert('Please fill in all fields with valid information');
//       return;
//     }

//     // Implement your registration logic here
//     console.log('Register button pressed');
//   };

//   const navigateToLogin = () => {
//     // Navigate to the login screen
//     navigation.navigate('logIn');
//   };

//   return (
//     <View style={{flex: 1}}>
//       {/* <Header navigation={navigation} /> */}
//       <ScrollView>
//         <View style={styles.container}>
//           <Text style={styles.heading}>Register</Text>

//           {/* Input fields for First Name, Last Name, Email, Mobile, Password, Address, State, Country, Pincode */}
//           <TextInput
//             style={styles.input}
//             placeholder="First Name"
//             value={firstName}
//             onChangeText={text => setFirstName(text)}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Last Name"
//             value={lastName}
//             onChangeText={text => setLastName(text)}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             keyboardType="email-address"
//             value={email}
//             onChangeText={text => setEmail(text)}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Mobile Number"
//             keyboardType="phone-pad"
//             value={mobile}
//             onChangeText={text => setMobile(text)}
//           />
//           {/* <View style={styles.container}>
//             <Text style={styles.label}>Choose an option:</Text>
//             <DropDownPicker
//               items={items}
//               defaultValue={selectedValue}
//               containerStyle={styles.dropdownContainer}
//               style={styles.dropdown}
//               itemStyle={styles.dropdownItem}
//               labelStyle={styles.dropdownLabel}
//               dropDownStyle={styles.dropdownMenu}
//               onChangeItem={(item: {value: React.SetStateAction<null>}) =>
//                 setSelectedValue(item.value)
//               }
//             />
//             <Text style={styles.selectedValue}>
//               Selected Value: {selectedValue}
//             </Text>
//           </View> */}
//           {/* <View style={{borderColor: '#FF9933'}}>
//             <Text>Select your role:</Text>
//             <Picker
//               style={{borderColor: '#FF9933', borderWidth: 2, marginBottom: 20, height: 55}}
//               selectedValue={role}
//               onValueChange={(itemValue: any) => setRole(itemValue)}>
//               <Picker.Item style={{borderWidth: 2}} label="Worker" value="worker" />
//               <Picker.Item style={{backgroundColor: 'blue'}} label="Employer" value="employer" />
//             </Picker>
//           </View> */}
//           <TextInput
//             style={styles.input}
//             placeholder="Password"
//             secureTextEntry
//             value={password}
//             onChangeText={text => setPassword(text)}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Full Address"
//             value={address}
//             onChangeText={text => setAddress(text)}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="State"
//             value={state}
//             onChangeText={text => setState(text)}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Country"
//             value={country}
//             onChangeText={text => setCountry(text)}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Pincode"
//             keyboardType="numeric"
//             value={pincode}
//             onChangeText={text => setPincode(text)}
//           />

//           {/* Register button */}
//           <TouchableOpacity
//             style={styles.registerButton}
//             onPress={handleRegister}>
//             <Text style={styles.registerButtonText}>Register</Text>
//           </TouchableOpacity>

//           {/* Line to redirect to the login screen */}
//           <Link href="/auth/login" asChild>
//           <TouchableOpacity>
//             <Text style={styles.loginRedirect}>
//               Already have an account? Log in here
//             </Text>
//           </TouchableOpacity>
//           </Link>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   input: {
//     height: 40,
//     borderColor: '#FF9933',
//     borderWidth: 1,
//     marginBottom: 20,
//     padding: 10,
//     // borderRadius: 5,
//   },
//   registerButton: {
//     backgroundColor: '#FF9933',
//     padding: 15,
//     // borderRadius: 5,
//     alignItems: 'center',
//   },
//   registerButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   loginRedirect: {
//     marginTop: 20,
//     textAlign: 'center',
//     color: 'black',
//   },
//   // container: {
//   //   flex: 1,
//   //   justifyContent: 'center',
//   //   alignItems: 'center',
//   //   backgroundColor: '#ecf0f1',
//   // },
//   label: {
//     fontSize: 16,
//     marginBottom: 10,
//     color: '#2c3e50',
//   },
//   dropdownContainer: {
//     height: 40,
//     width: 200,
//   },
//   dropdown: {
//     backgroundColor: '#3498db',
//   },
//   dropdownItem: {
//     justifyContent: 'flex-start',
//     backgroundColor: '#2980b9',
//   },
//   dropdownLabel: {
//     color: '#fff',
//   },
//   dropdownMenu: {
//     backgroundColor: '#3498db',
//   },
//   selectedValue: {
//     marginTop: 20,
//     fontSize: 18,
//     color: '#2c3e50',
//   },
// });

// export default RegisterScreen;

import Background from "@/components/Background";
import Button from "@/components/Button";
import DateField from "@/components/Calender";
import CalenderComp from "@/components/Calender";
import Counter from "@/components/Counter";
import Dropdown from "@/components/Dropdown";
import Field from "@/components/Field";
import ImagePickerExample from "@/components/ImagePicker";
import TextArea from "@/components/TextArea";
import { darkGreen } from "@/constants/Colors";
import { Link } from "expo-router";
import React from "react";
import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const Signup = (props: any) => {
  return (
    <Background>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ alignItems: "center", width: 460 }}>
          <Text
            style={{
              color: "white",
              fontSize: 64,
              fontWeight: "bold",
              marginTop: 20,
            }}
          >
            Add Service
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 19,
              fontWeight: "bold",
              marginBottom: 20,
            }}
          >
            Give one more opportunity to workers
          </Text>
          <View
            style={{
              backgroundColor: "white",
              height: 700,
              width: 460,
              borderTopLeftRadius: 130,
              paddingTop: 50,
              alignItems: "center",
            }}
          >
            <Field placeholder="Work" style={{ borderRadius: 4 }} />
            <Field placeholder="Address" style={{ borderRadius: 4 }} />
            <TextArea placeholder="Description" style={{ borderRadius: 4 }} />
            <DateField />
            <View style={styles.addRequirmentWrapper}>
              <Text
                style={{
                  fontWeight: "bold",
                  marginBottom: 4
                }}
              >
                Add Requirments
              </Text>
              <View style={styles.addRequirment}>
                <Dropdown />
                <Counter />
              </View>
            </View>
            {/* <ImagePickerExample /> */}
            {/* <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '78%',
              paddingRight: 16
            }}>
            <Text style={{color: 'grey', fontSize: 16}}>
              By signing in, you agree to our{' '}
            </Text>
            <Text style={{color: darkGreen, fontWeight: 'bold', fontSize: 16}}>
              Terms & Conditions
            </Text>
          </View> */}

            {/* <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent :"center",
              width: '78%',
              paddingRight: 16,
              marginBottom: 10
            }}>
            <Text style={{color: 'grey', fontSize: 16}}>
              and {" "}
            </Text>
            <Text style={{color: darkGreen, fontWeight: 'bold', fontSize: 16}}>
              Privacy Policy
            </Text>
          </View> */}
            <Button
              textColor="white"
              bgColor={darkGreen}
              btnLabel="Post"
              Press={() => {
                alert("Accoutn created");
                props.navigation.navigate("Login");
              }}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {/* <Text style={{fontSize: 16, fontWeight: 'bold'}}>
              Already have an account ?{' '}
            </Text>
            <Link href="/auth/login" asChild>
            <TouchableOpacity>
              <Text
                style={{color: darkGreen, fontWeight: 'bold', fontSize: 16}}>
                Login
              </Text>
            </TouchableOpacity>
            </Link> */}
            </View>
          </View>
        </View>
      </ScrollView>
    </Background>
  );
};

export default Signup;

const styles = StyleSheet.create({
  addRequirmentWrapper: {
    marginVertical: 10,
  },
  addRequirment: {
    width: "78%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
