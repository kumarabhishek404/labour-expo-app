import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LocationField from "../inputs/LocationField";
import Button from "../inputs/Button";
import * as Location from "expo-location";
import { useAtom } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";

interface AddLocationAndAddressProps {
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
        // cordinates: {
        latitude: currentLocation?.coords?.latitude,
        longitude: currentLocation?.coords?.longitude,
        latitudeDelta: 2,
        longitudeDelta: 2,
        // },
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
          <Text style={styles.radioText}>Address</Text>
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
          <Text style={styles.radioText}>Current Location</Text>
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
              style={styles?.locationButton}
              isPrimary={true}
              title="Get Current Location"
              onPress={fetchCurrentLocation}
              loading={isLoading}
            />

            {location && (
              <View style={styles.locationText}>
                <Text style={{ fontWeight: "600" }}>Address: </Text>
                {location ? (
                  <Text
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {address}
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: 12,
                      alignSelf: "flex-end",
                    }}
                  >
                    Please fetch current location
                  </Text>
                )}
              </View>
            )}
          </View>
        </>
      )}
      {errors[name] && (
        <Text style={styles.errorText}>{errors[name]?.message || ""}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    // marginBottom: 20,
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
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioChecked: {
    width: 12,
    height: 12,
    borderRadius: 8,
    backgroundColor: "#000",
  },
  radioText: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 15,
  },
  dropdownContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
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
  locationButton: {
    height: 53,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  locationText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default AddLocationAndAddress;
