// // import Header from '@/components/common/Header';
// // import { useNavigation } from 'expo-router';
// import React, { useContext, useState } from "react";
// import { Link } from "expo-router";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Pressable,
// } from "react-native";
// import { useStateContext } from "../context/context";
// // import Header from '../../../Header';
// // import AppContext from '../../../../utils/AppContext';

// const LogIn = () => {
//   const { state, dispatch }: any = useStateContext();
//   //   const {state, logInUser} = useContext(AppContext);
//   // const navigation = useNavigation()
  // const [mobile, setMobile] = useState("");
  // const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

  // const handleLogin = () => {
  //   console.log("Login button pressed");
  //   dispatch({ type: "LOGIN", payload: { mobile: mobile, password: password } });
  // };

//   return (
//     <View style={{ flex: 1 }}>
//       {/* <Header navigation={navigation} /> */}
//       <View style={styles.container}>
//         <Text style={styles.heading}>Log In</Text>

//         {/* Input fields for mobile number, email, and password */}
//         <TextInput
//           value={mobile}
//           style={styles.input}
//           placeholder="Mobile Number"
//           keyboardType="phone-pad"
//           placeholderTextColor="#FF9933"
//           onChangeText={(text) => setMobile(text)}
//         />
//         <TextInput
//           style={styles.input}
//           value={email}
//           placeholder="Email"
//           keyboardType="email-address"
//           placeholderTextColor="#FF9933"
//           onChangeText={(text) => setEmail(text)}
//         />
//         <TextInput
//           style={styles.input}
//           value={password}
//           placeholder="Password"
//           placeholderTextColor="#FF9933"
//           secureTextEntry
//           onChangeText={(text) => setPassword(text)}
//         />

//         {/* Login button */}
//         <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//           <Text style={styles.loginButtonText}>Log In</Text>
//         </TouchableOpacity>

//         {/* Option to redirect to the register screen */}
//         <Link href="/auth/register" asChild>
//           <TouchableOpacity>
//             <Text style={styles.registerLink}>
//               Don't have an account? Register here
//             </Text>
//           </TouchableOpacity>
//         </Link>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     // justifyContent: 'center',
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 30,
//     marginTop: 30,
//     textAlign: "center",
//   },
//   input: {
//     height: 40,
//     borderColor: "#FF9933",
//     color: "#FF9933",
//     borderWidth: 1,
//     marginBottom: 20,
//     padding: 10,
//     // borderRadius: 5,
//   },
//   loginButton: {
//     backgroundColor: "#FF9933",
//     padding: 15,
//     // borderRadius: 5,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   loginButtonText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 20,
//   },
//   registerLink: {
//     marginTop: 20,
//     textAlign: "center",
//     color: "black",
//   },
// });

// export default LogIn;

import Background from "@/components/Background";
import Button from "@/components/Button";
import Field from "@/components/Field";
import { darkGreen } from "@/constants/Colors";
import { Link } from "expo-router";
import React, { useState } from "react";
import { View, Text, Touchable, TouchableOpacity } from "react-native";
import { useStateContext } from "../context/context";

const Login = (props: any) => {
  const { state, dispatch }: any = useStateContext();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Login button pressed");
    dispatch({ type: "LOGIN", payload: { mobile: mobile, password: password } });
  };

  return (
    <Background>
      <View style={{ alignItems: "center", width: 460 }}>
        <Text
          style={{
            color: "white",
            fontSize: 64,
            fontWeight: "bold",
            marginVertical: 20,
          }}
        >
          Login
        </Text>
        <View
          style={{
            backgroundColor: "white",
            height: 700,
            width: 460,
            borderTopLeftRadius: 130,
            paddingTop: 100,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 40, color: darkGreen, fontWeight: "bold" }}>
            Welcome Back
          </Text>
          <Text
            style={{
              color: "grey",
              fontSize: 19,
              fontWeight: "bold",
              marginBottom: 20,
            }}
          >
            Login to your account
          </Text>
          <Field
            placeholder="Email / Mobile"
            value={mobile}
            keyboardType="phone-pad"
            onChangeText={(text:string) => setMobile(text)}
          />
          <Field 
            placeholder="Password" 
            secureTextEntry={true}
            value={password}
            onChangeText={(text:string) => setPassword(text)}
             />
          <View
            style={{
              alignItems: "flex-end",
              width: "78%",
              paddingRight: 16,
              marginBottom: 200,
            }}
          >
            <Text
              style={{ color: darkGreen, fontWeight: "bold", fontSize: 16 }}
            >
              Forgot Password ?
            </Text>
          </View>
          <Button
            textColor="white"
            bgColor={darkGreen}
            btnLabel="Login"
            Press={handleLogin}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Don't have an account ?{" "}
            </Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <Text
                  style={{ color: darkGreen, fontWeight: "bold", fontSize: 16 }}
                >
                  Signup
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </Background>
  );
};

export default Login;
