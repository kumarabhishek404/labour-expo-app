import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LocationField from "./LocationField";
import Button from "./Button";
import * as Location from "expo-location";

const AddLocationAndAddress = ({
  address,
  setAddress,
  location,
  setLocation,
}: any) => {
  const [selectedOption, setSelectedOption] = useState("address");
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
      console.log(
        "response of Expo Location ---",
        currentLocation,
        response[0]?.formattedAddress
      );
    } catch (err) {
      setIsLoading(false);
      console.log("Error while fetching location");
    }
  };

  return (
    <View style={styles.container}>
      {/* Radio Buttons */}
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

      {/* Render Based on Selected Option */}
      {selectedOption === "address" ? (
        <LocationField address={address} setAddress={setAddress} />
      ) : (
        <View style={styles.locationContainer}>
          <Button
            style={styles?.locationButton}
            isPrimary={true}
            title="Get Current Location"
            onPress={fetchCurrentLocation}
          />

          {location && (
            <View style={styles.locationText}>
              <Text style={{ fontWeight: "600" }}>Address: </Text>
              <Text style={{ flex: 1 }}>
                {address}
              </Text>
            </View>
          )}
        </View>
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
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioChecked: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#000",
  },
  radioText: {
    fontSize: 16,
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
    marginBottom: 16,
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
});

export default AddLocationAndAddress;
