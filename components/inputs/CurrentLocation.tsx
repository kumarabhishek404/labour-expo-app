import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { fetchCurrentLocation } from "@/constants/functions";
import { useAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import USER from "@/app/api/user";
import TOAST from "@/app/hooks/toast";
import CustomText from "@/components/commons/CustomText";
import { t } from "@/utils/translationHelper";
import CustomHeading from "../commons/CustomHeading";

interface Props {
  label: string;
  name: string;
  address: string;
  setAddress: (val: string) => void;
  location: any;
  setLocation: (val: any) => void;
  savedAddress?: string[];
  setSavedAddress?: (val: string[]) => void;
  errors?: any;
  isRequired?: boolean;
}

const AutoLocationButton = ({
  label,
  name,
  address,
  setAddress,
  location,
  setLocation,
  savedAddress = [],
  setSavedAddress,
  errors,
  isRequired,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useAtom(Atoms.UserAtom);

  const errorMessage = errors?.[name]?.message;

  console.log("location-----", location);
  console.log("address----", address);

  const fetchAndSaveLocation = async () => {
    try {
      setLoading(true);

      const { location: tempLocation, address: tempAddress }: any =
        await fetchCurrentLocation();

      if (!tempAddress) {
        TOAST.error(t("locationNotFound"));
        return;
      }

      // ⭐ React Hook Form value update
      setAddress(tempAddress);
      setLocation(tempLocation);

      // ⭐ Save address history
      if (setSavedAddress) {
        const exist = savedAddress?.includes(tempAddress);
        if (!exist) setSavedAddress([...savedAddress, tempAddress]);
      }

      // ⭐ Update global user state
      setUserDetails({
        ...userDetails,
        tempAddress,
        tempLocation,
      });

      // ⭐ Save to backend
      await USER.updateUserById({
        _id: userDetails?._id,
        tempAddress,
        tempLocation,
      });

      TOAST.success(t("locationSaved"));
    } catch (err) {
      console.log(err);
      TOAST.error(t("locationError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* ⭐ Label */}
      <Text style={styles?.labelContainer}>
        {label && (
          <CustomHeading
            textAlign="left"
            color={Colors.inputLabel}
            baseFont={16}
            fontWeight="500"
          >
            {t(label)}
          </CustomHeading>
        )}
        {isRequired && (
          <CustomHeading
            textAlign="left"
            color={Colors.danger}
            baseFont={16}
            fontWeight="500"
          >
            {" "}
            ({t("required")})
          </CustomHeading>
        )}
      </Text>

      {/* ⭐ Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={fetchAndSaveLocation}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Ionicons name="location" size={22} color="white" />
            <CustomText style={styles.buttonText}>
              {t("fetchLocation")}
            </CustomText>
          </>
        )}
      </TouchableOpacity>

      {/* ⭐ Selected Address */}
      {address ? (
        <View style={styles.addressBox}>
          <Ionicons name="checkmark-circle" size={18} color="green" />
          <CustomText textAlign="left" style={styles.addressText}>{address}</CustomText>
        </View>
      ) : null}

      {/* ⭐ Validation Error */}
      {errorMessage && (
        <CustomText style={styles.errorText}>{errorMessage}</CustomText>
      )}
    </View>
  );
};

export default AutoLocationButton;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 15,
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  addressBox: {
    backgroundColor: "#eef7ee",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  addressText: {
    flex: 1,
    fontSize: 14,
  },
  errorText: {
    color: "red",
    fontSize: 13,
  },
  labelContainer: {
    flexDirection: "row",
    gap: 5,
  },
});
