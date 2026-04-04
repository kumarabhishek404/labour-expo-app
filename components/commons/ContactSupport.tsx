import React from "react";
import { View, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import CustomText from "@/components/commons/CustomText";
import { t } from "@/utils/translationHelper";

const SUPPORT_PHONE = "+916397308499";
const SUPPORT_WHATSAPP = "916397308499";

export default function ContactSupport() {
  const openDialer = () => Linking.openURL(`tel:${SUPPORT_PHONE}`);

  const openWhatsApp = () =>
    Linking.openURL(
      `https://wa.me/${SUPPORT_WHATSAPP}?text=${t("supportWhatsappMessage")}`,
    );

  return (
    <View style={styles.card}>
      <CustomText textAlign="center" baseFont={16}>
        {t("supportTitle")}
      </CustomText>

      <CustomText textAlign="center" baseFont={16} fontWeight="600">
        {t("supportSubtitle")}
      </CustomText>

      <View style={styles.actions}>
        {/* <TouchableOpacity style={styles.callBtn} onPress={openDialer}>
          <Feather name="phone-call" size={22} color="#fff" />
          <CustomText color="#fff" fontWeight="700" baseFont={16}>
            {t("callUs")}
          </CustomText>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
          <FontAwesome name="whatsapp" size={26} color="#fff" />
          <CustomText color="#fff" fontWeight="700" baseFont={16}>
            {t("whatsappUs")}
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 25,
    backgroundColor: "#FFF7ED",
    borderRadius: 16,
    padding: 18,
    gap: 8,
    borderWidth: 2,
    borderColor: "#FDBA74",
    elevation: 3,
  },

  actions: {
    marginTop: 12,
    gap: 12,
  },

  callBtn: {
    flexDirection: "row",
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  whatsappBtn: {
    flexDirection: "row",
    backgroundColor: "#22C55E",
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  emailBtn: {
    flexDirection: "row",
    backgroundColor: "#F97316",
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});
