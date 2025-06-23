import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { router, Stack } from "expo-router";
import CustomHeader from "@/components/commons/Header";
import Colors from "@/constants/Colors";
import * as Location from "expo-location";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";

const ServiceDetailScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [bookingData, setBookingData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    address: "",
    house: "",
    area: "",
    location: "",
  });
  const [useLocation, setUseLocation] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);

  const isMobileValid = /^[6-9]\d{9}$/.test(bookingData.mobile);

  const isFormValid =
    bookingData.firstName &&
    bookingData.lastName &&
    isMobileValid &&
    (useLocation
      ? bookingData.address
      : bookingData.house && bookingData.area && bookingData.location);

  const fetchLocation = async () => {
    try {
      setLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(location.coords);
      if (geocode?.length) {
        const place = geocode[0];
        const address = `${place.name || ""}, ${place.street || ""}, ${
          place.city || ""
        }, ${place.postalCode || ""}`;
        setBookingData((prev) => ({ ...prev, address }));
      }
    } catch (error) {
      TOAST.error("Failed to fetch location.");
    } finally {
      setLocationLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleBook = () => {
    setModalVisible(true);
  };

  const handleConfirm = () => {
    Alert.alert(
      "Booking Confirmed",
      `Thank you ${bookingData.firstName}, your booking is confirmed.`
    );
    setModalVisible(false);
  };

  const serviceDetails = {
    name: "Fan Installation",
    description:
      t("fanInstallation"),
    cost: "₹299",
    duration: "30–45 mins",
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader title="serviceDetails" left="back" />
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{serviceDetails.name}</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>{t("description")}</Text>
          <Text style={styles.text}>{serviceDetails.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>{t("cost")}</Text>
          <Text style={styles.text}>{serviceDetails.cost}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>{t("estimatedTime")}</Text>
          <Text style={styles.text}>{serviceDetails.duration}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>{t("cancel")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
            <Text style={styles.bookText}>{t("book")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("completeBooking")}</Text>

            {/* Common Inputs */}
            <TextInput
              placeholder={t("firstName")}
              style={styles.input}
              value={bookingData.firstName}
              onChangeText={(text) =>
                setBookingData({ ...bookingData, firstName: text })
              }
            />
            <TextInput
              placeholder={t("lastName")}
              style={styles.input}
              value={bookingData.lastName}
              onChangeText={(text) =>
                setBookingData({ ...bookingData, lastName: text })
              }
            />
            <TextInput
              placeholder={t("mobileNumber")}
              style={[
                styles.input,
                !isMobileValid && bookingData.mobile.length > 0
                  ? { borderColor: "red" }
                  : {},
              ]}
              keyboardType="phone-pad"
              value={bookingData.mobile}
              onChangeText={(text) =>
                setBookingData({ ...bookingData, mobile: text })
              }
            />

            {/* Toggle Option */}
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              <TouchableOpacity
                style={[
                  styles.toggleOption,
                  useLocation ? styles.activeToggle : {},
                ]}
                onPress={() => setUseLocation(true)}
              >
                <Text
                  style={{
                    color: useLocation ? "#fff" : "#333",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  {t("useCurrentLocation")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleOption,
                  !useLocation ? styles.activeToggle : {},
                ]}
                onPress={() => setUseLocation(false)}
              >
                <Text
                  style={{
                    color: !useLocation ? "#fff" : "#333",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  {t("enterAddressManually")}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Conditional UI */}
            {useLocation ? (
              <>
                <TouchableOpacity
                  style={styles.locationBtn}
                  onPress={fetchLocation}
                  disabled={locationLoading}
                >
                  <Text style={styles.locationText}>
                    {locationLoading
                      ? t("fetchingLocation")
                      : t("getMyCurrentLocation")}
                  </Text>
                </TouchableOpacity>
                {bookingData.address ? (
                  <Text style={[styles.input, { color: "#000" }]}>
                    {bookingData.address}
                  </Text>
                ) : null}
              </>
            ) : (
              <>
                <TextInput
                  placeholder={t("houseStreet")}
                  style={styles.input}
                  value={bookingData.house}
                  onChangeText={(text) =>
                    setBookingData({ ...bookingData, house: text })
                  }
                />
                <TextInput
                  placeholder={t("areaLandmark")}
                  style={styles.input}
                  value={bookingData.area}
                  onChangeText={(text) =>
                    setBookingData({ ...bookingData, area: text })
                  }
                />
                <TextInput
                  placeholder={t("location")}
                  style={styles.input}
                  value={bookingData.location}
                  onChangeText={(text) =>
                    setBookingData({ ...bookingData, location: text })
                  }
                />
              </>
            )}

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>{t("cancel")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalConfirm,
                  { backgroundColor: isFormValid ? Colors.tertiery : "#ccc" },
                ]}
                disabled={!isFormValid}
                onPress={handleConfirm}
              >
                <Text style={styles.bookText}>{t("confirmBooking")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ServiceDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelText: {
    color: "#333",
    fontWeight: "500",
    fontSize: 16,
  },
  bookButton: {
    backgroundColor: Colors.tertiery,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  bookText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: "#222",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
    color: "#333",
  },
  locationBtn: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  locationText: {
    color: "#444",
    textAlign: "center",
    fontSize: 14,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalCancel: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  modalConfirm: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  toggleOption: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: "center",
  },
  activeToggle: {
    backgroundColor: Colors.tertiery,
  },
});
