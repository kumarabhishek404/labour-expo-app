import { ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router, Stack } from "expo-router";
import DropdownComponent from "@/components/inputs/Dropdown";
import { useAtom } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import CustomHeader from "@/components/commons/Header";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import Button from "@/components/inputs/Button";
import { STETESOFINDIA } from "@/constants";

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
          header: () => <CustomHeader title="Add Address" left="back" />,
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={styles.formContainer}>
          <TextInputComponent
            value={village}
            style={styles.textInput}
            placeholder="Village"
            onChangeText={setVillage}
            label="Village"
            name="village"
            icon={
              <Fontisto
                name="holiday-village"
                size={20}
                color={Colors.secondary}
              />
            }
          />
          <TextInputComponent
            value={post}
            style={styles.textInput}
            placeholder="Post"
            onChangeText={setPost}
            label="Post"
            name="post"
            icon={
              <MaterialIcons
                name="local-post-office"
                size={28}
                color={Colors.secondary}
              />
            }
          />
          <TextInputComponent
            value={city}
            style={styles.textInput}
            placeholder="City"
            onChangeText={setCity}
            label="City"
            name="city"
            icon={
              <FontAwesome5 name="city" size={20} color={Colors.secondary} />
            }
          />
          <TextInputComponent
            value={pinCode}
            style={styles.textInput}
            placeholder="Pin Code"
            onChangeText={setPinCode}
            label="Pin Code"
            name="pinCode"
            icon={<Feather name="map-pin" size={22} color={Colors.secondary} />}
          />

          <DropdownComponent
            label="State"
            value={state}
            setValue={(state: any) => setState(state)}
            placeholder="Select State"
            options={STETESOFINDIA}
            icon={
              <FontAwesome6
                style={styles.icon}
                color="black"
                name="map-location"
                size={20}
              />
            }
          />
          <TextInputComponent
            value={country}
            style={styles.textInput}
            placeholder="Country"
            onChangeText={() => {}}
            label="Country"
            name="country"
            icon={
              <FontAwesome name="flag" size={22} color={Colors.secondary} />
            }
          />

          <Button
            isPrimary={true}
            title="Save Address"
            onPress={handleAddService}
            style={{marginTop: 10}}
          />
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
    gap: 10,
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
