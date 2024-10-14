import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  Link,
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import Colors from "@/constants/Colors";
import { useAtom, useAtomValue } from "jotai";
import {
  AddServiceAtom,
  AddServiceInProcess,
  UserAtom,
} from "@/app/AtomStore/user";
import TextInputComponent from "@/components/TextInputWithIcon";
import Button from "@/components/Button";
import { toast } from "@/app/hooks/toast";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import Stepper from "@/app/(tabs)/addService/stepper";
import { COUNTRYPHONECODE, REGISTERSTEPS } from "@/constants";
import MobileNumberField from "@/components/mobileNumber";
import EmailAddressField from "@/components/emailAddress";
import AddLocationAndAddress from "@/components/AddLocationAndAddress";
import { Controller, useForm } from "react-hook-form";

interface SecondScreenProps {
  setStep: any;
  address: string;
  setAddress: any;
  location: string;
  setLocation: any;
  phoneNumber: string;
  setPhoneNumber: any;
  countryCode: string;
  setCountryCode: any;
  email: string;
  setEmail: any;
}

const SecondScreen: React.FC<SecondScreenProps> = ({
  setStep,
  address,
  setAddress,
  location,
  setLocation,
  phoneNumber,
  setPhoneNumber,
  countryCode,
  setCountryCode,
  email,
  setEmail,
}: SecondScreenProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: address,
      location: location,
      countryCode: countryCode,
      phoneNumber: phoneNumber,
      email: email,
    },
  });

  const handleNext = () => {
    setStep(3);
    // if (title && description) {
    //   setAddService({
    //     ...addService,
    //     name: title,
    //     description: description,
    //   });
    //   setIsAddService(true);
    //   router?.push("/(tabs)/addService/second");
    // } else {
    //   toast.error("Please fill all the input fields");
    // }
  };

  const onSubmit = (data: any) => {
    setAddress(data?.address);
    setCountryCode(data?.countryCode);
    setPhoneNumber(data?.phoneNumber);
    setEmail(data?.email);
    // setLastName(data?.lastName);
    setStep(3);
  };

  return (
    <>
      <View style={{ marginBottom: 20 }}>
        <Stepper currentStep={2} steps={REGISTERSTEPS} />
      </View>
      <View style={{ flexDirection: "column", gap: 15 }}>
        <Controller
          control={control}
          name="address"
          defaultValue=""
          rules={{
            required: false,
            // required: "Address is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <AddLocationAndAddress
              name="address"
              address={value}
              setAddress={onChange}
              onBlur={onBlur}
              location={location}
              setLocation={setLocation}
              errors={errors}
            />
          )}
        />

        <Controller
          control={control}
          name="phoneNumber"
          defaultValue=""
          rules={{
            required: false,
            // required: "Mobile number is required",
            // pattern: {
            //   value: /^(\+91[\-\s]?)?[6-9]\d{9}$/,
            //   message: "Enter a valid mobile number",
            // },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MobileNumberField
              name="phoneNumber"
              countriesPhoneCode={COUNTRYPHONECODE}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              phoneNumber={value}
              setPhoneNumber={onChange}
              onBlur={onBlur}
              errors={errors}
              placeholder="Entet mobile number"
              icon={
                <Feather
                  name={"phone"}
                  size={30}
                  color={Colors.secondary}
                  style={{ paddingVertical: 10, paddingRight: 10 }}
                />
              }
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          defaultValue=""
          rules={{
            required: false,
            // required: "Email address is required",
            // pattern: {
            //   value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            //   message: "Enter a valid email address",
            // },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <EmailAddressField
              name="email"
              email={value}
              setEmail={onChange}
              onBlur={onBlur}
              errors={errors}
              placeholder="Enter email address"
              icon={
                <Ionicons
                  name={"mail-outline"}
                  size={30}
                  color={Colors.secondary}
                  style={{ paddingVertical: 10 }}
                />
              }
            />
          )}
        />
      </View>
      <View style={styles?.buttonContainer}>
        <Button isPrimary={false} title="Back" onPress={() => setStep(1)} />
        <Button
          isPrimary={true}
          title="Save and Next"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
  },
  customHeader: {
    width: "100%",
    marginTop: 40,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "700",
    fontSize: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 40,
  },

  label: {
    marginVertical: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  buttonText: {
    color: Colors?.white,
    fontWeight: "700",
    textAlign: "center",
    fontSize: 18,
  },

  forgotPasswordText: {
    textAlign: "right",
    color: Colors.primary,
    // fontFamily: fonts.SemiBold,
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginTop: 20,
  },
  loginText: {
    color: Colors.white,
    fontSize: 20,
    // fontFamily: fonts.SemiBold,
    textAlign: "center",
    padding: 10,
  },
});

export default SecondScreen;
