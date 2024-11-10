import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import LocationField from "../inputs/LocationField";
import Button from "../inputs/Button";
import * as Location from "expo-location";
import { useAtom } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import CustomHeading from "./CustomHeading";
import Colors from "@/constants/Colors";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";

interface AddLocationAndAddressProps {
  label: string;
  name: string;
  address: string;
  setAddress: any;
  location: any;
  setLocation: any;
  selectedOption: string;
  setSelectedOption: any;
  onBlur: any;
  errors: any;
  icon?: any;
}

const AddLocationAndAddress = ({
  label,
  name,
  address,
  setAddress,
  location,
  setLocation,
  selectedOption,
  setSelectedOption,
  onBlur,
  errors,
}: AddLocationAndAddressProps) => {
  const [userDetails, setUserDetails] = useAtom(UserAtom);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCurrentLocation = async () => {
    setIsLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Please grant location permission");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      let tempLocation = {
        latitude: currentLocation?.coords?.latitude,
        longitude: currentLocation?.coords?.longitude,
        latitudeDelta: 2,
        longitudeDelta: 2,
      };
      setLocation(tempLocation);
      let response: any = await Location.reverseGeocodeAsync({
        latitude: tempLocation?.latitude,
        longitude: tempLocation?.longitude,
      });
      setIsLoading(false);
      setAddress(response[0]?.formattedAddress);
      let tempUserDetails = { ...userDetails };
      tempUserDetails = {
        ...userDetails,
        serviceAddress: [
          ...(userDetails?.serviceAddress ? userDetails?.serviceAddress : []),
          response[0]?.formattedAddress,
        ],
      };
      setUserDetails(tempUserDetails);
    } catch (err) {
      setIsLoading(false);
      console.log("Error while fetching location");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setSelectedOption("address")}
        >
          <View style={styles.radioCircle}>
            {selectedOption === "address" && (
              <View style={styles.radioChecked} />
            )}
          </View>
          {label && <CustomHeading>{label}</CustomHeading>}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setSelectedOption("currentLocation")}
        >
          <View style={styles.radioCircle}>
            {selectedOption === "currentLocation" && (
              <View style={styles.radioChecked} />
            )}
          </View>
          <CustomHeading>{t("currentLocation")}</CustomHeading>
        </TouchableOpacity>
      </View>

      {selectedOption === "address" ? (
        <LocationField
          address={address}
          setAddress={setAddress}
          isError={errors[name]}
        />
      ) : (
        <>
          <View style={styles.locationContainer}>
            <Button
              isPrimary={true}
              title={t("getCurrentLocation")}
              onPress={fetchCurrentLocation}
              loading={isLoading}
            />

            {location && (
              <View style={styles.locationText}>
                <CustomText>{t("address")}: </CustomText>
                {location ? (
                  <CustomText
                    style={{ width: "92%" }}
                    textAlign="left"
                    fontWeight="bold"
                  >
                    {address}
                  </CustomText>
                ) : (
                  <CustomText style={{ width: "92%" }} textAlign="left">
                    {t("pleaseFetchCurrentLocation")}
                  </CustomText>
                )}
              </View>
            )}
          </View>
        </>
      )}
      {errors[name] && (
        <CustomText textAlign="left" fontSize={10} color={Colors?.danger}>
          {errors[name]?.message || ""}
        </CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    gap: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors?.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  radioChecked: {
    width: 12,
    height: 12,
    borderRadius: 8,
    backgroundColor: Colors?.primary,
  },
  radioText: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 15,
  },
  dropdownContainer: {
    marginTop: 20,
  },
  picker: {
    height: 50,
    width: "100%",
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#f9f9f9",
  },
  locationContainer: {
    marginBottom: 10,
  },
  locationText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
});

export default AddLocationAndAddress;
