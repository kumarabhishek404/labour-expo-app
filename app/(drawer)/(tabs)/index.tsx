import React from "react";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import AdminServices from "../../screens/bottomTabs/(admin)/services";
import UserHome from "../../screens/bottomTabs/(user)/home";

export default function BookingsScreen() {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  switch (userDetails?.role) {
    case "ADMIN":
      return <AdminServices />;
    case "EMPLOYER":
    case "WORKER":
    case "MEDIATOR":
      return <UserHome />;
    default:
      return <UserHome />;
  }
}


// import React, { useState } from 'react';
// import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
// import { signInWithPhoneNumber, verifyCode } from '../api/firebase';

// const OTPVerificationScreen = () => {
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [code, setCode] = useState('');
//     const [confirmation, setConfirmation] = useState<any>(null);

//     const handleSendOTP = async () => {
//         try {
//             const confirmationResult = await signInWithPhoneNumber(phoneNumber);
//             setConfirmation(confirmationResult);
//             Alert.alert('OTP sent to your phone!');
//         } catch (error) {
//             Alert.alert('Error', 'Failed to send OTP. Please try again.');
//         }
//     };

//     const handleVerifyCode = async () => {
//         try {
//             const result = await verifyCode(confirmation, code);
//             if (result) {
//                 Alert.alert('Success', 'Phone number verified successfully!');
//             }
//         } catch (error) {
//             Alert.alert('Error', 'Invalid OTP code. Please try again.');
//         }
//     };

//     return (
//         <View style={styles.container}>
//             {!confirmation ? (
//                 <>
//                     <Text style={styles.label}>Enter Phone Number:</Text>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="+1234567890"
//                         keyboardType="phone-pad"
//                         value={phoneNumber}
//                         onChangeText={setPhoneNumber}
//                     />
//                     <Button title="Send OTP" onPress={handleSendOTP} />
//                 </>
//             ) : (
//                 <>
//                     <Text style={styles.label}>Enter OTP:</Text>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="123456"
//                         keyboardType="number-pad"
//                         value={code}
//                         onChangeText={setCode}
//                     />
//                     <Button title="Verify OTP" onPress={handleVerifyCode} />
//                 </>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//         justifyContent: 'center',
//     },
//     label: {
//         fontSize: 16,
//         marginBottom: 8,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         padding: 8,
//         marginBottom: 16,
//         borderRadius: 4,
//     },
// });

// export default OTPVerificationScreen;