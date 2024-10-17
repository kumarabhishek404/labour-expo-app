import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Link, router, Stack } from "expo-router";
import DropdownComponent from "@/components/Dropdown";
import { STETESOFINDIA } from "@/constants";
import { useAtom } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";

const AddCurrentLocation = () => {
  const navigation = useNavigation();
  const [secureEntery, setSecureEntery] = useState(true);
  const [userDetails, setUserDetails] = useAtom(UserAtom);
  const [village, setVillage] = useState("");
  const [post, setPost] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");

  const handleAddService = () => {
    let payload = {
      village: village,
      post: post,
      city: city,
      pinCode: pinCode,
      state: state,
      country: country,
    };
    const address = `${village}, ${post} ${city} ${pinCode} ${state} ${country}`;
    let tempUserDetails = userDetails;
    tempUserDetails.serviceAddress = [...userDetails?.serviceAddress, address];
    setUserDetails(tempUserDetails);
    router.back();
    // navigation.navigate("LOGIN");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerTitle: "Add Address",
          headerTintColor: Colors.white,
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                marginRight: 20,
                backgroundColor: Colors.white,
                padding: 6,
                borderRadius: 8,
                shadowColor: "#171717",
                shadowOffset: { width: 2, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            >
              <Feather name="arrow-left" size={20} />
            </TouchableOpacity>
          ),
          // headerRight: () => (
          //   <TouchableOpacity
          //     onPress={() => {}}
          //     style={{
          //       marginLeft: 20,
          //       backgroundColor: Colors.white,
          //       padding: 6,
          //       borderRadius: 8,
          //       shadowColor: "#171717",
          //       shadowOffset: { width: 2, height: 4 },
          //       shadowOpacity: 0.2,
          //       shadowRadius: 3,
          //     }}
          //   >
          //     <Ionicons name="notifications" size={20} color={Colors.black} />
          //   </TouchableOpacity>
          // ),
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Village</Text>
          <View style={styles.inputContainer}>
            <Fontisto
              name="holiday-village"
              size={25}
              color={Colors.secondary}
            />
            <TextInput
              value={village}
              style={styles.textInput}
              placeholder="Village"
              placeholderTextColor={Colors.secondary}
              onChangeText={setVillage}
            />
          </View>
          <Text style={styles.inputLabel}>Post</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="local-post-office"
              size={35}
              color={Colors.secondary}
            />
            <TextInput
              value={post}
              style={styles.textInput}
              placeholder="Post"
              placeholderTextColor={Colors.secondary}
              onChangeText={setPost}
            />
          </View>
          <Text style={styles.inputLabel}>City</Text>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="city" size={25} color={Colors.secondary} />
            <TextInput
              value={city}
              style={styles.textInput}
              placeholder="City"
              placeholderTextColor={Colors.secondary}
              onChangeText={setCity}
            />
          </View>
          <Text style={styles.inputLabel}>Pin Code</Text>
          <View style={styles.inputContainer}>
            <Feather name="map-pin" size={30} color={Colors.secondary} />
            <TextInput
              value={pinCode}
              style={styles.textInput}
              placeholder="Pin Code"
              placeholderTextColor={Colors.secondary}
              onChangeText={setPinCode}
            />
          </View>
          <Text style={styles.inputLabel}>State</Text>
          <View style={{ marginBottom: 20 }}>
            <DropdownComponent
              value={state}
              setValue={(state: any) => setState(state)}
              placeholder="Select State"
              options={STETESOFINDIA}
              icon={
                <FontAwesome6
                  style={styles.icon}
                  color="black"
                  name="map-location"
                  size={25}
                />
              }
            />
          </View>

          <Text style={styles.inputLabel}>Country</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="flag" size={30} color={Colors.secondary} />
            <TextInput
              value={country}
              style={styles.textInput}
              placeholder="Country"
              placeholderTextColor={Colors.secondary}
              onChangeText={() => {}}
            />
          </View>

          <TouchableOpacity
            onPress={handleAddService}
            style={styles.loginButtonWrapper}
          >
            <Text style={styles.loginText}>Save Address</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default AddCurrentLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: Colors.gray,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    fontSize: 32,
    color: Colors.primary,
    // fontFamily: fonts.SemiBold,
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    height: 53,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 20,
  },
  inputLabel: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    // fontFamily: fonts.Light,
  },
  forgotPasswordText: {
    textAlign: "right",
    color: Colors.primary,
    // fontFamily: fonts.SemiBold,
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    marginTop: 20,
    marginBottom: 60,
  },
  loginText: {
    color: Colors.white,
    fontSize: 20,
    // fontFamily: fonts.SemiBold,
    textAlign: "center",
    padding: 10,
  },
  signupButtonWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    // marginTop: 20,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    // fontFamily: fonts.Regular,
    color: Colors.primary,
  },
  googleButtonContainer: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 20,
    width: 20,
  },
  googleText: {
    fontSize: 20,
    // fontFamily: fonts.SemiBold,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: Colors.primary,
    // fontFamily: fonts.Regular,
  },
  redirectButtonWrapper: {
    // width: '100%',
    // display: 'flex',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
    marginVertical: 20,
  },
  loginButton: {
    flexDirection: "row",
    borderWidth: 2,
    height: 50,
    borderColor: Colors.primary,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    paddingHorizontal: 20,
    gap: 10,
  },
  signupText: {
    color: Colors.primary,
  },
  icon: {
    marginRight: 10,
    color: Colors.secondary,
  },
});
